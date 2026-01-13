package com.dqd.hust.quanlychungcu.model

data class DashboardItem(
    val title: String,
    val desc: String,
    val imgRes: Int,     // ID ảnh trong res/drawable
    val linkTo: String,  // Đường dẫn Web
    val roles: List<String> // [MỚI] Danh sách quyền được phép xem (vd: ["admin", "ketoan"])
)