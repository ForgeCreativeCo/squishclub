package com.forgecreativeco.squishtradeclub;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * A full-screen WebView around the hosted Squish Trade Club site. The game
 * itself lives on Netlify, so pushing a change to the site updates the app
 * too — this wrapper only needs rebuilding if this file changes.
 *
 * Navigation is locked to the game's own host, so a kid can't follow a link
 * out to the open web from inside the app.
 */
public class MainActivity extends Activity {

    static final String GAME_URL = "https://squishtradeclub.netlify.app/";
    static final String GAME_HOST = Uri.parse(GAME_URL).getHost();

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = createWebView();
        setContentView(webView);
        enterImmersiveMode();
        if (savedInstanceState == null || webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(GAME_URL);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private WebView createWebView() {
        WebView view = new WebView(this);
        view.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        view.setBackgroundColor(getResources().getColor(R.color.app_background, getTheme()));

        WebSettings s = view.getSettings();
        s.setJavaScriptEnabled(true);
        // Firebase keeps the anonymous sign-in and the offline Firestore cache
        // in IndexedDB/localStorage; without these, progress resets on relaunch.
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        // Ignore the tablet's font-size setting so the game layout doesn't break.
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportMultipleWindows(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setUserAgentString(s.getUserAgentString() + " SquishTradeClubApp");

        CookieManager.getInstance().setAcceptCookie(true);
        view.setWebViewClient(new GameClient());
        return view;
    }

    private class GameClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            // Returning true blocks the navigation; only the game's own pages may load.
            return !GAME_HOST.equals(request.getUrl().getHost());
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            // The service worker normally serves the game offline after the
            // first launch; this only shows if the very first load fails.
            if (request.isForMainFrame()) {
                view.loadDataWithBaseURL(GAME_URL, OFFLINE_PAGE, "text/html", "utf-8", null);
            }
        }

        @Override
        @TargetApi(26) // only called on Android 8+; older Fire OS just never hits it
        public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
            // The WebView's renderer was killed (usually low memory). Rebuild it
            // instead of letting the whole app crash.
            ViewGroup parent = (ViewGroup) view.getParent();
            if (parent != null) parent.removeView(view);
            view.destroy();
            webView = createWebView();
            setContentView(webView);
            webView.loadUrl(GAME_URL);
            return true;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            // Keep the game alive in the background rather than finishing it.
            moveTaskToBack(true);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) enterImmersiveMode();
    }

    @SuppressWarnings("deprecation")
    private void enterImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        webView.onPause();
        CookieManager.getInstance().flush();
        super.onPause();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }

    private static final String OFFLINE_PAGE =
            "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>"
            + "<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;"
            + "justify-content:center;background:#FBF7FF;font-family:sans-serif;color:#3a2a4a;text-align:center;padding:24px;box-sizing:border-box}"
            + "h1{font-size:28px;margin:0 0 8px}p{font-size:18px;margin:0 0 24px}"
            + "a{background:#FF5FA2;color:#fff;text-decoration:none;font-size:22px;font-weight:bold;"
            + "padding:16px 40px;border-radius:999px}</style></head><body>"
            + "<h1>Can't reach the Squish Club</h1>"
            + "<p>Check that the tablet is connected to Wi-Fi, then try again.</p>"
            + "<a href='" + GAME_URL + "'>Try again</a></body></html>";
}
