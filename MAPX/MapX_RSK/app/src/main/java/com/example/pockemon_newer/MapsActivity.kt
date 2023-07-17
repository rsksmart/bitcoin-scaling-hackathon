package com.example.pockemon_newer

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import android.util.Log
import android.view.LayoutInflater
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import kotlinx.coroutines.runBlocking
import kotlin.math.roundToInt
import android.content.DialogInterface

import android.text.Editable

import android.widget.EditText
import androidx.core.app.ActivityCompat
import androidx.core.location.LocationManagerCompat.getCurrentLocation
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationServices.getFusedLocationProviderClient
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch


class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    private var mMap: GoogleMap?=null

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    var boolcheck = true
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_maps)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

         fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        checkpermission()
        loadpockemon()
    }
    var ACCESSLOCATION=123
    fun checkpermission() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (ActivityCompat.checkSelfPermission(
                    this,
                    android.Manifest.permission.ACCESS_FINE_LOCATION

                ) != PackageManager.PERMISSION_GRANTED
            ) {
                requestPermissions(arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION), ACCESSLOCATION)
                return
            }
        }


        GetUserLocation()
    }

    @SuppressLint("MissingPermission")
    fun GetUserLocation()
    {
        Toast.makeText(this,"user location access on",Toast.LENGTH_LONG).show()
        //TODO: Will implement later

        var myloaction=myLocationListener()
        var locationmanager=getSystemService(Context.LOCATION_SERVICE) as LocationManager

        //locationmanager.requestLocationUpdates(LocationManager.GPS_PROVIDER,3,3f,myloaction);
        locationmanager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,3,3f,myloaction)

        var mythread=mythread()
        mythread().start()

    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {

        when(requestCode){

            ACCESSLOCATION->{

                if(grantResults[0]==PackageManager.PERMISSION_GRANTED)
                {
                    GetUserLocation()
                }
                else
                {
                    Toast.makeText(this,"We cannot access to your location",Toast.LENGTH_LONG).show()
                }
            }
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap


    }


    //get user location
    var location1:Location?=null
inner class myLocationListener : LocationListener
    {   constructor()
    {

        location1 = Location("Start")

    }
        override fun onLocationChanged(p0: Location) {
           //

        }


    }

    var oldlocation:Location?=null
    inner class mythread:Thread
    {
        constructor():super()
        {
            oldlocation= Location("Start")

        }
        @SuppressLint("MissingPermission")
        override  fun run()
        {
            while(true)
            {
                try {

                    if(oldlocation==location1)
                    {
                        continue
                    }

                    oldlocation=location1
                    runOnUiThread {
                        mMap!!.clear()
                        val geoLocation = fusedLocationClient.lastLocation
                            .addOnSuccessListener { location : Location? ->
                               if(location != null){
                               location1= location
                      // Got last known location. In some rare situations this can be null.
                               }
                            }

                        //show me
                        val sydney = LatLng(location1!!.latitude, location1!!.longitude)
                        mMap!!.addMarker(
                            MarkerOptions()
                                .position(sydney)
                                .title("Me")
                                .snippet("Here is my location")
                                .icon(BitmapDescriptorFactory.fromResource(R.drawable.traveller1))
                        )



                        //show MapX

                        for(i in 0..listpockemons.size-1)
                        {
                            if(boolcheck){
                                fusedLocationClient.lastLocation
                                    .addOnSuccessListener { location : Location? ->
                                        if(location != null){
                                            location1= location
                                            // Got last known location. In some rare situations this can be null.
                                            val sydneyone= LatLng(location1!!.latitude, location1!!.longitude)
                                            mMap!!.moveCamera(CameraUpdateFactory.newLatLngZoom(sydneyone, 14f))
                                            mMap!!.animateCamera(CameraUpdateFactory.newLatLngZoom(sydneyone, 14f))
                                            boolcheck=false
                                        }}

                            }
                            var newpockemon=listpockemons[i]

                            if(newpockemon.iscatch==false)
                            {
                                val pockemonloc = LatLng(newpockemon.location!!.latitude, newpockemon.location!!.longitude)
                                mMap!!.addMarker(
                                    MarkerOptions()
                                        .position(pockemonloc)
                                        .title(newpockemon.name!!)
                                        .snippet(newpockemon.des!!+", power:"+newpockemon!!.power)
                                        .icon(BitmapDescriptorFactory.fromResource(newpockemon.image!!))
                                )


                                if(location1!!.distanceTo(newpockemon.location)<100)
                                {   var newnftname = ""
                                    if(newpockemon.name=="Taj Mahal"){
                                        newnftname = "art"
                                    }
                                    else if (newpockemon.name=="Paris"){
                                        newnftname = "cityilluminati"
                                    }
                                    else if (newpockemon.name=="Irish Boho"){
                                        newnftname = "collectiable1"
                                    }
                                    else if (newpockemon.name=="Tie Dye"){
                                        newnftname = "collectiables"
                                    }
                                    else if (newpockemon.name=="Ronald McDonald Spacecraft"){
                                        newnftname = "mcdonald"
                                    }
                                    else if (newpockemon.name=="Theatre La Gazelle"){
                                        newnftname = "movietheatre"
                                    }
                                    else if (newpockemon.name=="Tokyo"){
                                        newnftname = "location"
                                    }
                                    else if (newpockemon.name=="Chai Offer"){
                                        newnftname = "voucher"
                                    }
                                    else if (newpockemon.name=="Space NFT"){
                                        newnftname = "location"
                                    }
                                    else if (newpockemon.name=="Disney Land"){
                                        newnftname = "movietheatre"
                                    }
                                    else{
                                        newnftname = "art"
                                    }
                                    var key = intent.getStringExtra("KEY")!!.replace(" ","")
                                    Toast.makeText(baseContext, key, Toast.LENGTH_LONG).show()
                                    newpockemon.iscatch=true
                                    listpockemons[i]=newpockemon
                                    playerpower+=newpockemon.power!!
                                    Toast.makeText(applicationContext,"Yeah !! You Just Minted New NFT and Your Popularity is "+playerpower,Toast.LENGTH_LONG).show()
                                    val queue= Volley.newRequestQueue( baseContext)
                                   GlobalScope.launch  {
                                       val stringRequest = StringRequest(Request.Method.GET,
                                           "https://rootstock-api.onrender.com/mintnft/${key}/${newnftname}",
                                           { response ->
                                               try {
                                                   Toast.makeText(
                                                       baseContext,
                                                       "Block Hash " + response,
                                                       Toast.LENGTH_LONG
                                                   ).show()

                                               } catch (exception: Exception) {
                                                   exception.printStackTrace()
                                               }
                                           },
                                           { error ->
                                               Toast.makeText(
                                                   baseContext,
                                                   error.message,
                                                   Toast.LENGTH_SHORT
                                               ).show()
                                           }
                                       )
                                       queue.add(stringRequest)
                                   }

                                }


                            }
                        }
                    }

                    Thread.sleep(1000)
                }
                catch (ex:Exception)
                {

                }
            }

            super.run()
        }
    }


    var playerpower=0.0
    var listpockemons=ArrayList<MapX>()
    fun loadpockemon()
    {
        var lat = intent.getStringExtra("LAT")!!.replace(" ","")
        var long = intent.getStringExtra("LONG")!!.replace(" ","")
        if (lat.isEmpty()){
            lat = "19.878895"
        }
        if(long.isEmpty()){
            long = "75.354420"
        }
        listpockemons.add(MapX(R.drawable.cart,
            "Taj Mahal", "One of Kind Art", 55.0, 27.17381, 78.0421))
        listpockemons.add(MapX(R.drawable.cityilluminati,
            "Paris", "City Of Illumination", 90.5,  48.8566, 2.3522))
        listpockemons.add(MapX(R.drawable.collectiable1,
            "Irish Boho", "Mint and Get 10% off on Hats", 33.5, 28.5016, 77.0952))
        listpockemons.add(MapX(R.drawable.collectiables,
            "Tie Dye", "Mint and Get 50% off on Shirts", 33.5, -22.9519, -43.2105))
        listpockemons.add(MapX(R.drawable.mcdonald,
            "Ronald McDonald Spacecraft", "I'm lovin' Web3, Mint it and get 5% off", 33.5, -33.8688, 151.2093))
        listpockemons.add(MapX(R.drawable.movietheatre,
            "Theatre La Gazelle", "Live The Movie", 33.5, 36.1716, -115.1391))

        listpockemons.add(MapX(R.drawable.location,
            "Tokyo", "Endless Discovery", 33.5, 33.6762, 139.6503))

        listpockemons.add(MapX(R.drawable.voucher,
            "Chai Offer", "A healthy sip and 5% off for Everyone", 33.5, lat!!.toDouble(), long!!.toDouble()))
        listpockemons.add(MapX(R.drawable.spacelocation,
            "Space NFT", "Too The MOON ticket", 33.5,  28.573469, -80.651070))
        listpockemons.add(MapX(R.drawable.disneyland,
            "Disney Land", "Happiest Place on Earth", 33.5, 55.3871, 3.4360))








    }
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        val inflater: MenuInflater = menuInflater
        inflater.inflate(R.menu.collection, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        return when (item.itemId) {
            R.id.homePage -> {
                startActivity(
                    Intent(
                        this@MapsActivity,
                        CollectionActivity::class.java
                    )
                )
                true
            }


            else -> super.onOptionsItemSelected(item)
        }
    }

}
