package com.example.pockemon_newer

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView

class CollectionAdapter(private val listOfNews: MutableList<Data>) : BaseAdapter() {
    override fun getCount() = listOfNews.size

    override fun getItem(position: Int) = listOfNews[position]

    override fun getItemId(position: Int) = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {

        val context = parent?.context
        var rowView = convertView

        val inflater: LayoutInflater =
            context?.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater

        if (rowView == null)
            rowView = inflater.inflate(R.layout.list_item, parent, false)

        val item = listOfNews[position]

        val title = rowView?.findViewById<TextView>(R.id.title_text_view)
        title?.text = item.nftname



        return rowView!!
    }
}