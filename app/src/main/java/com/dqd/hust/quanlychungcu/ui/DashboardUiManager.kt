package com.dqd.hust.quanlychungcu.ui

import android.content.Context
import android.util.DisplayMetrics
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.dqd.hust.quanlychungcu.R
import com.dqd.hust.quanlychungcu.adapter.DashboardAdapter
import com.dqd.hust.quanlychungcu.model.DashboardItem
import com.dqd.hust.quanlychungcu.utils.SessionManager

class DashboardUiManager(
    private val context: Context,
    private val recyclerView: RecyclerView,
    private val sessionManager: SessionManager,
    private val onMenuClick: (DashboardItem) -> Unit
) {

    // 1. DANH SÁCH GỐC (MASTER LIST)
    private val allDashboardItems = listOf(
        // --- NHÓM ADMIN ---
        DashboardItem(
            "Quản lý hộ khẩu", "Quản lý hộ khẩu và các khoản thu theo hộ",
            R.drawable.ho_khau, "/ho-gia-dinh/ho-khau",
            listOf("admin")
        ),
        DashboardItem(
            "Quản lý căn hộ", "Quản lý các căn hộ trong chung cư",
            R.drawable.chung_cu, "/ho-gia-dinh/can-ho",
            listOf("admin")
        ),
        DashboardItem(
            "Quản lý nhân khẩu", "Quản lý nhân khẩu, đăng ký nhân khẩu",
            R.drawable.nhan_khau, "/quan-ly-nhan-dan/nhan-khau",
            listOf("admin")
        ),
        DashboardItem(
            "Quản lý tạm trú", "Quản lý tạm trú, đăng ký tạm trú",
            R.drawable.tam_tru, "/quan-ly-nhan-dan/tam-tru",
            listOf("admin")
        ),
        DashboardItem(
            "Quản lý tạm vắng", "Quản lý tạm vắng, đăng ký tạm vắng",
            R.drawable.tam_vang, "/quan-ly-nhan-dan/tam-vang",
            listOf("admin")
        ),
        DashboardItem(
            "Quản lý gửi xe", "Quản lý gửi ô tô, xe máy của các hộ",
            R.drawable.gui_xe, "/quan-ly-gui-xe",
            listOf("admin")
        ),

        // --- NHÓM DÙNG CHUNG (ADMIN + KETOAN) ---
        DashboardItem(
            "Quản lý khoản thu", "Quản lý các khoản thu phí trong chung cư",
            R.drawable.thu_chi, "/quan-ly-khoan-thu",
            listOf("admin", "ketoan")
        ),

        // --- NHÓM KẾ TOÁN ---
        DashboardItem(
            "Kiểm tra khoản thu", "Kiểm tra trạng thái khoản thu",
            R.drawable.ke_toan, "/kiem-tra-khoan-thu",
            listOf("ketoan")
        ),

        // --- NHÓM USER (Cư dân) ---
        DashboardItem(
            "Thông tin cá nhân", "Xem và cập nhật thông tin cá nhân",
            R.drawable.ca_nhan, "/thong-tin-ca-nhan",
            listOf("user")
        ),
        DashboardItem(
            "Thành viên gia đình", "Quản lý danh sách thành viên",
            R.drawable.gia_dinh, "/thanh-vien-gia-dinh",
            listOf("user")
        ),
        DashboardItem(
            "Khoản thu", "Xem hóa đơn và đóng phí",
            R.drawable.khoan_thu, "/khoan-thu",
            listOf("user")
        )
    )

    // 2. Hàm cài đặt giao diện
    fun setup() {
        // A. Lấy quyền từ Session (Đã được chuẩn hóa ở LoginActivity rồi)

        val currentRole = sessionManager.getRole()

        // B. Lọc danh sách trực tiếp
        val filteredItems = allDashboardItems.filter { item ->
            item.roles.contains(currentRole)
        }

        // C. Gắn Adapter
        val adapter = DashboardAdapter(filteredItems) { item ->
            onMenuClick(item)
        }
        recyclerView.adapter = adapter

        // D. Gọi hàm tính toán số cột (Để giao diện đẹp trên mọi màn hình)
        updateColumnCount()
    }

    // Hàm tính toán cột Responsive
    fun updateColumnCount() {
        val displayMetrics: DisplayMetrics = context.resources.displayMetrics
        val screenWidthDp = displayMetrics.widthPixels / displayMetrics.density

        // Quy ước: Mỗi ô Dashboard rộng khoảng 160dp
        val desiredColumnWidthDp = 160

        // Tính số cột: (Độ rộng màn hình / 160), tối thiểu là 2 cột
        val spanCount = (screenWidthDp / desiredColumnWidthDp).toInt().coerceAtLeast(2)

        recyclerView.layoutManager = GridLayoutManager(context, spanCount)
    }
}