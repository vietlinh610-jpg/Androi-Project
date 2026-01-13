package com.dqd.hust.quanlychungcu.utils

import android.net.http.SslError
import android.webkit.CookieManager
import android.webkit.SslErrorHandler
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient

interface WebViewListener {
    fun onShowNativeDashboard()
    fun onHideLoadingMask()
    fun getTargetLink(): String?
    fun onResetTargetLink()
}

class MyWebViewClient(
    private val sessionManager: SessionManager,
    private val listener: WebViewListener
) : WebViewClient() {

    override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
        handler?.proceed()
    }

    // 1. Bắt sự kiện khi bấm Link chuyển trang (Click chủ động)
    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url.toString()
        // Nếu Web lỡ bị đá về trang Login hoặc Dashboard -> Hiện Native App
        if (isDashboardOrLogin(url)) {
            listener.onShowNativeDashboard()
            return true
        }
        return false
    }

    // 2. [MỚI - QUAN TRỌNG] Bắt sự kiện đổi URL của ReactJS (Bấm Back, History change)
    // React đổi URL mà không load lại trang, hàm này sẽ bắt được
    override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
        super.doUpdateVisitedHistory(view, url, isReload)

        if (url != null && isDashboardOrLogin(url)) {
            // Nếu URL đổi về dashboard -> Bật giao diện Native ngay
            listener.onShowNativeDashboard()
        }
    }

    // 3. Xử lý khi trang đã load xong (Token injection) - Code cũ của bạn
    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        //if (url == "about:blank") return
        CookieManager.getInstance().flush()
        val currentUrl = url ?: ""

        // 3.1. LUÔN BƠM TOKEN
        val token = sessionManager.getToken()
        val role = sessionManager.getRole()
        val userId = sessionManager.getUserId()
        val fullName = sessionManager.getFullName()

        if (token.isNotEmpty()) {
            view?.evaluateJavascript(
                JavascriptScripts.getAuthInjection(token, role, userId, fullName),
                null
            )
        }

        // 3.2. Kiểm tra lại lần nữa nếu lỡ đang ở dashboard
        if (isDashboardOrLogin(currentUrl)) {
            listener.onShowNativeDashboard()
            return
        }

        // 3.3. Xử lý logic ẩn Loading (Giữ nguyên logic của bạn)
        val targetLink = listener.getTargetLink()
        if (targetLink != null) {
            if (currentUrl.contains(targetLink)) {
                injectJsUiFix(view)
                listener.onResetTargetLink()
                listener.onHideLoadingMask()
            }
        } else {
            injectJsUiFix(view)
            listener.onHideLoadingMask()
        }
    }

    private fun injectJsUiFix(view: WebView?) {
        view?.evaluateJavascript(JavascriptScripts.DASHBOARD_FIX_UI, null)
    }

    // Hàm phụ trợ để kiểm tra link (Gọn code)
    private fun isDashboardOrLogin(url: String): Boolean {
        return url.contains("/login") ||
                url.contains("/dashboard") ||
                url == Constants.BASE_URL ||
                url == "${Constants.BASE_URL}/"
    }
}