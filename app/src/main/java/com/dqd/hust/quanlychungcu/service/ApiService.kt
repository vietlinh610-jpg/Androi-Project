package com.dqd.hust.quanlychungcu.service

import com.dqd.hust.quanlychungcu.model.LoginRequest
import com.dqd.hust.quanlychungcu.model.LoginResponse
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("/api/login/login")
    fun loginUser(@Body request: LoginRequest): Call<LoginResponse>

    companion object {
        // Link Ngrok của bạn
        private const val BASE_URL = "https://crysta-unfunny-isabel.ngrok-free.dev"

        fun create(): ApiService {
            // Cấu hình Client để Bypass Ngrok bằng User-Agent (GIỐNG WEBVIEW TỐI QUA)
            val client = OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val original = chain.request()
                    val request = original.newBuilder()
                        .header("User-Agent", "ngrok-skip-browser-warning")
                        .method(original.method, original.body)
                        .build()
                    chain.proceed(request)
                }
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}