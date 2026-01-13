package com.dqd.hust.quanlychungcu.utils

import android.content.Context
import android.content.Intent
import android.webkit.CookieManager
import android.webkit.WebStorage
import com.dqd.hust.quanlychungcu.LoginActivity

class SessionManager(private val context: Context) {

    // Dùng Constants để đảm bảo đồng bộ tên file và key
    private val prefs = context.getSharedPreferences(Constants.PREFS_NAME, Context.MODE_PRIVATE)

    // --- LẤY DỮ LIỆU ---
    fun getToken(): String = prefs.getString(Constants.KEY_TOKEN, "") ?: ""
    fun getRole(): String = prefs.getString(Constants.KEY_ROLE, "user") ?: "user"

    // [MỚI] Thêm hàm lấy ID và Tên
    fun getUserId(): String = prefs.getString(Constants.KEY_USER_ID, "") ?: ""
    fun getFullName(): String = prefs.getString(Constants.KEY_FULL_NAME, "") ?: ""

    // Lấy thông tin ghi nhớ đăng nhập (Giữ nguyên)
    fun getSavedUser(): String = prefs.getString("SAVED_USER", "") ?: ""
    fun getSavedPass(): String = prefs.getString("SAVED_PASS", "") ?: ""
    fun isRemembered(): Boolean = prefs.getBoolean("IS_REMEMBER", false)

    private val KEY_HISTORY = "LOGIN_HISTORY"

    // [MỚI] 1. Hàm lấy danh sách lịch sử (trả về mảng String để Adapter dùng)
    fun getLoginHistory(): List<String> {
        val historySet = prefs.getStringSet(KEY_HISTORY, HashSet()) ?: HashSet()
        return historySet.toList()
    }

    // [MỚI] 2. Hàm thêm một tên đăng nhập mới vào lịch sử
    fun addUserToHistory(username: String) {
        // Lấy danh sách cũ ra
        val oldSet = prefs.getStringSet(KEY_HISTORY, HashSet()) ?: HashSet()

        // Tạo bản sao mới (Bắt buộc phải tạo bản sao thì Android mới nhận biết sự thay đổi)
        val newSet = HashSet(oldSet)
        newSet.add(username)

        // Lưu lại
        prefs.edit().putStringSet(KEY_HISTORY, newSet).apply()
    }

    // --- LƯU DỮ LIỆU (CẬP NHẬT) ---
    // Sửa hàm này để nhận thêm userId và fullName
    fun saveSession(token: String, role: String, userId: String, fullName: String) {
        val editor = prefs.edit()
        editor.putString(Constants.KEY_TOKEN, token)
        editor.putString(Constants.KEY_ROLE, role)

        // [MỚI] Lưu thêm thông tin định danh
        editor.putString(Constants.KEY_USER_ID, userId)
        editor.putString(Constants.KEY_FULL_NAME, fullName)

        editor.apply()
    }

    fun saveRememberUser(user: String, pass: String, isRemember: Boolean) {
        val editor = prefs.edit()
        if (isRemember) {
            editor.putString("SAVED_USER", user)
            editor.putString("SAVED_PASS", pass)
            editor.putBoolean("IS_REMEMBER", true)
        } else {
            editor.remove("SAVED_USER")
            editor.remove("SAVED_PASS")
            editor.putBoolean("IS_REMEMBER", false)
        }
        editor.apply()
    }

    // --- ĐĂNG XUẤT ---
    fun logout() {
        // 1. Xóa Token, Role, ID, Name
        val editor = prefs.edit()
        editor.remove(Constants.KEY_TOKEN)
        editor.remove(Constants.KEY_ROLE)
        editor.remove(Constants.KEY_USER_ID)   // [MỚI] Xóa ID
        editor.remove(Constants.KEY_FULL_NAME) // [MỚI] Xóa Tên
        editor.apply()

        // 2. Xóa Cookie Web
        CookieManager.getInstance().removeAllCookies(null)
        WebStorage.getInstance().deleteAllData()

        // 3. Về Login
        val intent = Intent(context, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        context.startActivity(intent)
    }
}