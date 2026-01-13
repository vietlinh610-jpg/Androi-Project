package com.dqd.hust.quanlychungcu

import android.content.Intent
import android.content.res.Configuration // [MỚI] Để xử lý xoay màn hình
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.WebView
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.PopupMenu
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isGone
import androidx.recyclerview.widget.RecyclerView
import com.dqd.hust.quanlychungcu.ui.DashboardUiManager
import com.dqd.hust.quanlychungcu.utils.Constants
import com.dqd.hust.quanlychungcu.utils.MyWebViewClient
import com.dqd.hust.quanlychungcu.utils.SessionManager
import com.dqd.hust.quanlychungcu.utils.WebViewListener

class MainActivity : AppCompatActivity(), WebViewListener {

    private lateinit var webView: WebView
    private lateinit var recyclerView: RecyclerView
    private lateinit var tvScreenTitle: TextView
    private lateinit var btnHome: ImageView
    private lateinit var nativeDashboardContainer: LinearLayout
    private lateinit var loadingLayout: LinearLayout

    // Biến cho phần Profile trên Header
    private lateinit var layoutProfile: LinearLayout
    private lateinit var tvHeaderName: TextView

    private lateinit var sessionManager: SessionManager
    private lateinit var dashboardUiManager: DashboardUiManager

    private var targetLinkToLoad: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Init Utils
        sessionManager = SessionManager(this)

        // Mapping View
        webView = findViewById(R.id.webView)
        recyclerView = findViewById(R.id.recyclerView)
        loadingLayout = findViewById(R.id.loadingLayout)
        nativeDashboardContainer = findViewById(R.id.nativeDashboardContainer)

        // Setup Header
        setupHeader()

        // Init Dashboard Manager
        dashboardUiManager = DashboardUiManager(this, recyclerView, sessionManager) { item ->
            openWebPage(item.linkTo, item.title)
        }
        dashboardUiManager.setup()

        setupWebView()
        setupBackNavigation()
        initializeSession()
    }

    // --- [MỚI 1] BẮT SỰ KIỆN XOAY MÀN HÌNH ---
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        // Khi xoay, tính toán lại số cột cho đẹp (Responsive)
        if (::dashboardUiManager.isInitialized) {
            dashboardUiManager.updateColumnCount()
        }
    }

    private fun setupHeader() {
        tvScreenTitle = findViewById(R.id.tvScreenTitle)
        btnHome = findViewById(R.id.btnHome)
        layoutProfile = findViewById(R.id.layoutProfile)
        tvHeaderName = findViewById(R.id.tvHeaderName)

        val fullName = sessionManager.getFullName()
        tvHeaderName.text = fullName.ifEmpty { "User" }

        btnHome.setOnClickListener {
            onShowNativeDashboard()
        }

        layoutProfile.setOnClickListener { view ->
            showProfileMenu(view)
        }
    }

    private fun showProfileMenu(anchorView: View) {
        val popup = PopupMenu(this, anchorView)

        val rawRole = sessionManager.getRole()
        val displayRole = when {
            rawRole.equals("admin", ignoreCase = true) -> "Quản trị viên"
            rawRole.equals("ketoan", ignoreCase = true) -> "Kế toán"
            else -> "Cư dân"
        }

        popup.menu.add(0, 1, 0, "Vai trò: $displayRole").isEnabled = false

        popup.menu.add(0, 2, 1, "Đăng xuất").setOnMenuItemClickListener {
            performLogout() // [SỬA] Gọi hàm logout đầy đủ
            true
        }

        popup.show()
    }

    // --- [MỚI 2] HÀM ĐĂNG XUẤT HOÀN CHỈNH ---
    private fun performLogout() {
        // 1. Xóa session
        sessionManager.logout()

        // 2. Chuyển về màn hình đăng nhập
        val intent = Intent(this, LoginActivity::class.java)
        // Xóa hết các Activity cũ trong Stack để không back lại được
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            userAgentString = "ngrok-skip-browser-warning"
            useWideViewPort = false
            loadWithOverviewMode = true
        }
        webView.webViewClient = MyWebViewClient(sessionManager, this)
    }

    private fun initializeSession() {
        onShowNativeDashboard()
        webView.loadUrl(Constants.BASE_URL)
    }

    private fun openWebPage(path: String, title: String) {
        targetLinkToLoad = path
        tvScreenTitle.text = title
        btnHome.visibility = View.VISIBLE
        layoutProfile.visibility = View.GONE
        showLoadingMask()
        nativeDashboardContainer.visibility = View.GONE
        val fullUrl = "${Constants.BASE_URL}$path"
        webView.loadUrl(fullUrl)
    }

    private fun showLoadingMask() {
        loadingLayout.visibility = View.VISIBLE
    }

    override fun onShowNativeDashboard() {
        targetLinkToLoad = null
        nativeDashboardContainer.visibility = View.VISIBLE

        // [LƯU Ý] Đảm bảo bạn có string này trong strings.xml hoặc sửa thành chuỗi cứng
        tvScreenTitle.text = getString(R.string.dashboard_header)

        btnHome.visibility = View.GONE
        layoutProfile.visibility = View.VISIBLE
        onHideLoadingMask()
        //webView.loadUrl("about:blank")
    }

    override fun onHideLoadingMask() {
        Handler(Looper.getMainLooper()).postDelayed({
            loadingLayout.visibility = View.GONE
        }, 500)
    }

    override fun getTargetLink(): String? = targetLinkToLoad

    override fun onResetTargetLink() {
        targetLinkToLoad = null
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (nativeDashboardContainer.isGone) {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        onShowNativeDashboard()
                    }
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}