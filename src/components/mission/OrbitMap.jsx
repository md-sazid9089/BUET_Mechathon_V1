import React from 'react'
import { motion } from 'framer-motion'
import { OrbitScene3D } from './orbit3d/OrbitScene3D'

export const OrbitMap = ({ selectedCluster }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    >
      <OrbitScene3D selectedCluster={selectedCluster} />
    </motion.div>
  )
}
