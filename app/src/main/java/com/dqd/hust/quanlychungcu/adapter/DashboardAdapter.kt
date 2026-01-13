package com.dqd.hust.quanlychungcu.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.dqd.hust.quanlychungcu.R
import com.dqd.hust.quanlychungcu.model.DashboardItem

class DashboardAdapter(
    private val items: List<DashboardItem>,
    private val onItemClick: (DashboardItem) -> Unit
) : RecyclerView.Adapter<DashboardAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imgIcon: ImageView = view.findViewById(R.id.imgIcon)
        val tvTitle: TextView = view.findViewById(R.id.tvTitle)
        val tvDesc: TextView = view.findViewById(R.id.tvDescription)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_function, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.tvTitle.text = item.title
        holder.tvDesc.text = item.desc
        holder.imgIcon.setImageResource(item.imgRes)
        holder.itemView.setOnClickListener { onItemClick(item) }
    }

    override fun getItemCount() = items.size
}