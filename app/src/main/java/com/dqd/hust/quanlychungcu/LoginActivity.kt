package com.dqd.hust.quanlychungcu

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.dqd.hust.quanlychungcu.model.LoginRequest
import com.dqd.hust.quanlychungcu.model.LoginResponse
import com.dqd.hust.quanlychungcu.model.UserInfo
import com.dqd.hust.quanlychungcu.service.ApiService
import com.dqd.hust.quanlychungcu.utils.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    // [SỬA 1] Đổi từ EditText sang AutoCompleteTextView
    private lateinit var etUsername: AutoCompleteTextView
    private lateinit var etPassword: EditText
    private lateinit var cbRemember: CheckBox
    private lateinit var btnLogin: Button
    private lateinit var progressBar: ProgressBar

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)

        // --- KIỂM TRA ĐĂNG NHẬP TỰ ĐỘNG ---
        // Phải có Token VÀ đã từng chọn "Ghi nhớ" thì mới tự vào
        if (sessionManager.getToken().isNotEmpty() && sessionManager.isRemembered()) {
            goToDashboard()
            return
        }

        // Ánh xạ View
        etUsername = findViewById(R.id.etUsername)
        etPassword = findViewById(R.id.etPassword)
        cbRemember = findViewById(R.id.cbRemember)
        btnLogin = findViewById(R.id.btnLogin)
        progressBar = findViewById(R.id.progressBar)

        // [SỬA 2] Cài đặt Gợi ý lịch sử đăng nhập
        setupAutoComplete()

        // --- ĐIỀN THÔNG TIN GHI NHỚ (Nếu có) ---
        if (sessionManager.isRemembered()) {
            etUsername.setText(sessionManager.getSavedUser())
            etPassword.setText(sessionManager.getSavedPass())
            cbRemember.isChecked = true

            // Xóa focus để không hiện popup gợi ý ngay khi mới vào app (nhìn cho thoáng)
            etUsername.clearFocus()
        }

        btnLogin.setOnClickListener { performLogin() }
    }

    // [MỚI] Hàm thiết lập danh sách gợi ý
    private fun setupAutoComplete() {
        // 1. Lấy danh sách lịch sử
        val historyList = sessionManager.getLoginHistory()

        // 2. Tạo Adapter
        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_dropdown_item_1line,
            historyList
        )

        etUsername.setAdapter(adapter)

        // Đặt ngưỡng là 1 để gõ 1 chữ là hiện (hoặc chạm vào là hiện)
        etUsername.threshold = 1

        // [QUAN TRỌNG - ĐÃ SỬA LỖI]
        // Dùng view.post để đảm bảo Window đã sẵn sàng trước khi showDropDown
        etUsername.setOnFocusChangeListener { view, hasFocus ->
            if (hasFocus) {
                view.post {
                    // Kiểm tra kỹ Activity còn sống không
                    if (!isFinishing && !isDestroyed) {
                        etUsername.showDropDown()
                    }
                }
            }
        }

        // [SỰ KIỆN CLICK]
        etUsername.setOnClickListener { view ->
            view.post {
                if (!isFinishing && !isDestroyed) {
                    etUsername.showDropDown()
                }
            }
        }
    }

    private fun performLogin() {
        val username = etUsername.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Vui lòng nhập đủ thông tin!", Toast.LENGTH_SHORT).show()
            return
        }

        setLoading(true)

        // GỌI API
        val apiService = ApiService.create()
        val request = LoginRequest(username, password)

        apiService.loginUser(request).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                setLoading(false)
                if (response.isSuccessful && response.body() != null) {
                    val data = response.body()!!
                    onLoginSuccess(data.token, data.user)
                } else {
                    Toast.makeText(this@LoginActivity, "Sai tên đăng nhập hoặc mật khẩu!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                setLoading(false)
                Toast.makeText(this@LoginActivity, "Lỗi kết nối: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun onLoginSuccess(token: String, user: UserInfo) {
        // 1. Lưu thông tin Ghi nhớ (nếu tick)
        sessionManager.saveRememberUser(
            etUsername.text.toString(),
            etPassword.text.toString(),
            cbRemember.isChecked
        )

        // [SỬA 3] Lưu tên đăng nhập thành công vào lịch sử
        sessionManager.addUserToHistory(etUsername.text.toString().trim())

        // 2. Chuẩn hóa quyền
        val rawRole = user.quyen.trim()
        val safeRole = when {
            rawRole.equals("Admin", ignoreCase = true) -> "admin"
            rawRole.contains("Kế toán", ignoreCase = true) -> "ketoan"
            rawRole.contains("KeToan", ignoreCase = true) -> "ketoan"
            else -> "user"
        }

        // 3. Lưu Session ĐẦY ĐỦ (Token, Role, ID, Tên)
        sessionManager.saveSession(
            token = token,
            role = safeRole,
            userId = user.id,
            fullName = user.hoTen
        )

        Toast.makeText(this, "Xin chào ${user.hoTen}", Toast.LENGTH_SHORT).show()

        // 4. Vào Dashboard
        goToDashboard()
    }

    private fun goToDashboard() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun setLoading(isLoading: Boolean) {
        if (isLoading) {
            progressBar.visibility = View.VISIBLE
            btnLogin.isEnabled = false
            btnLogin.text = "ĐANG XỬ LÝ..."
        } else {
            progressBar.visibility = View.INVISIBLE
            btnLogin.isEnabled = true
            btnLogin.text = "ĐĂNG NHẬP"
        }
    }
}