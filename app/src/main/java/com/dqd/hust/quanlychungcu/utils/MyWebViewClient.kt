package com.dqd.hust.quanlychungcu.utils

import android.net.http.SslError
import android.webkit.CookieManager
import android.webkit.SslErrorHandler
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient

// Interface để giao tiếp ngược lại với MainActivity
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

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val url = request?.url.toString()
        // Nếu Web lỡ bị đá về trang Login hoặc Dashboard -> Hiện Native App
        if (url.contains("/login") || url.contains("/dashboard")) {
            listener.onShowNativeDashboard()
            return true
        }
        return false
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        CookieManager.getInstance().flush()
        val currentUrl = url ?: ""
        val baseUrl = Constants.BASE_URL

        // 1. LUÔN BƠM TOKEN
        val token = sessionManager.getToken()
        val role = sessionManager.getRole()
        val userId = sessionManager.getUserId()     // [MỚI]
        val fullName = sessionManager.getFullName() // [MỚI]
        if (token.isNotEmpty()) {
            // Gọi hàm getAuthInjection với đủ 4 tham số
            view?.evaluateJavascript(
                JavascriptScripts.getAuthInjection(token, role, userId, fullName),
                null
            )
        }

        // 2. Xử lý điều hướng
        val isLoginPage = (currentUrl == baseUrl) || (currentUrl == "$baseUrl/") || currentUrl.contains("/login")
        if (isLoginPage || currentUrl.contains("/dashboard")) {
            listener.onShowNativeDashboard()
            return
        }

        // 3. Xử lý hiển thị trang chức năng (Khóa mục tiêu)
        val targetLink = listener.getTargetLink()

        if (targetLink != null) {
            if (currentUrl.contains(targetLink)) {
                injectJsUiFix(view)
                listener.onResetTargetLink()
                listener.onHideLoadingMask()
            }
        } else {
            // Load tự do
            injectJsUiFix(view)
            listener.onHideLoadingMask()
        }
    }

    private fun injectJsUiFix(view: WebView?) {
        view?.evaluateJavascript(JavascriptScripts.DASHBOARD_FIX_UI, null)
    }
}