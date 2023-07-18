package com.example.pockemon_newer

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.pockemon_newer.databinding.ActivityPrivateBinding

class PrivateActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPrivateBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_private)
        binding = ActivityPrivateBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.submit.setOnClickListener {
            val privateKeyTekl = binding.privatekey.text.toString()
            val latitude= binding.lat.text.toString()
            val longtitude= binding.longtitude.text.toString()
            val intent = Intent(this, MapsActivity::class.java)
            intent.putExtra("KEY", privateKeyTekl)
            intent.putExtra("LAT",latitude)
            intent.putExtra("LONG",longtitude)
            startActivity(intent)
        }
    }
}