package com.example.pockemon_newer

import android.content.Intent
import android.graphics.LinearGradient
import android.graphics.Shader
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import androidx.appcompat.app.ActionBar
import com.example.pockemon_newer.databinding.ActivityPrivateBinding
import com.example.pockemon_newer.databinding.ActivityStartBinding

class StartActivity : AppCompatActivity() {
    private lateinit var binding: ActivityStartBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.hide(WindowInsets.Type.statusBars())
        }
        else {
            @Suppress("DEPRECATION")
            window.setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
            )
        }
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
        binding = ActivityStartBinding.inflate(layoutInflater)
        binding.textView2.setTextColor(resources.getColor(R.color.blue))

        val textShader: Shader = LinearGradient(
            0f, binding.textView2.paint.measureText(binding.textView2.text.toString()), 0f, 0f, intArrayOf(
                resources.getColor(R.color.deepblue), resources.getColor(R.color.pink)
            ), floatArrayOf(0f, 1f), Shader.TileMode.CLAMP
        )
        binding.textView2.paint.shader = textShader

        setContentView(binding.root)
         binding.reltive.setOnClickListener {
             val intent = Intent(this, PrivateActivity::class.java)
             startActivity(intent)
         }
    }
}