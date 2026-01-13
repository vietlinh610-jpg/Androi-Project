package com.dqd.hust.quanlychungcu.model

import com.google.gson.annotations.SerializedName

// 1. Request: Đã chuẩn
data class LoginRequest(
    @SerializedName("tenDangNhap") val tenDangNhap: String,
    @SerializedName("matKhau") val matKhau: String
)

// 2. Response: Nên thêm SerializedName
data class LoginResponse(
    @SerializedName("token") val token: String,
    @SerializedName("user") val user: UserInfo
)

// 3. UserInfo: Rất quan trọng, bắt buộc thêm SerializedName
data class UserInfo(
    @SerializedName("id") val id: String,       // Để String là chuẩn nhất (tránh lỗi nếu ID là UUID hoặc số quá lớn)
    @SerializedName("hoTen") val hoTen: String, // Khớp với JSON "hoTen"
    @SerializedName("quyen") val quyen: String  // Khớp với JSON "quyen" (VD: "Admin", "Kế toán")
)