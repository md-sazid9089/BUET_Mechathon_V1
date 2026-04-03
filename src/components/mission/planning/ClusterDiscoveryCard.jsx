import React from 'react'
import { motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'
import { CLUSTERS } from '../../../data/mockData'

export const ClusterDiscoveryCard = ({ onSelectCluster }) => {
  const selectedCluster = useMissionStore((state) => state.selectedCluster)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <GitBranch className="w-5 h-5 text-debris-warning" />
        Debris Clusters
      </h3>

      <div className="space-y-3">
        {CLUSTERS.map((cluster) => (
          <motion.div
            key={cluster.id}
            onClick={() => onSelectCluster(cluster)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedCluster?.id === cluster.id
                ? 'bg-debris-warning border-debris-warning'
                : 'bg-space-700 border-space-600 hover:border-space-500'
            }`}
          >
            <div className="font-mono text-sm font-bold mb-2">{cluster.name}</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div>Objects: {cluster.debrisCount}</div>
              <div>Altitude: {cluster.altitude}km</div>
              <div>Risk: {cluster.collisionRisk}%</div>
              <div className={`font-bold ${
                cluster.priority === 'CRITICAL' ? 'text-debris-danger' :
                cluster.priority === 'HIGH' ? 'text-debris-warning' :
                'text-debris-info'
              }`}>
                {cluster.priority}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!selectedCluster}
        className="w-full mt-4 btn-success text-sm disabled:opacity-50"
      >
        Analyze Cluster
      </motion.button>
    </motion.div>
  )
}
