import React, { useState } from 'react';
import { useDispatch } from '../../context/DispatchContext';
import { Package, Plus, CheckCircle2, Clock, X } from 'lucide-react';
import { OrderPriority, Vehicle } from '../../types';

export const OrderQueuePanel: React.FC = () => {
  const { orders, vehicles, addNewOrder } = useDispatch();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    destination_sector: '',
    weight_kg: 5,
    volume_m3: 0.1,
    priority: 'P3_STANDARD' as OrderPriority,
    assigned_vehicle_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOrders = filterPriority === 'ALL' 
    ? orders 
    : orders.filter(o => o.priority === filterPriority);

  const getPriorityBadge = (priority: OrderPriority) => {
    switch (priority) {
      case 'P1_URGENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/60 flex items-center space-x-1"><span>⚡</span><span>P1 URGENT</span></span>;
      case 'P2_EXPRESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-950/60 text-yellow-400 border border-yellow-800/60">P2 EXPRESS</span>;
      case 'P3_STANDARD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-400 border border-blue-800/60">P3 STANDARD</span>;
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addNewOrder({
        ...newOrder,
        lat: 12.8700 + (Math.random() - 0.5) * 0.05, // Random lat in Mangalore
        lng: 74.8450 + (Math.random() - 0.5) * 0.05, // Random lng in Mangalore
        assigned_vehicle_id: newOrder.assigned_vehicle_id || undefined
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <span>Order Manifest ({orders.length})</span>
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
          <div className="flex items-center space-x-1 text-[10px]">
            {['ALL', 'P1_URGENT', 'P2_EXPRESS'].map(f => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  filterPriority === f 
                    ? 'bg-cyan-500 text-white font-bold' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mt-3 overflow-y-auto pr-1 flex-1">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-cyan-400 font-bold">
                {order.tracking_code}
              </span>
              {getPriorityBadge(order.priority)}
            </div>

            <div className="mt-1.5 font-semibold text-white">
              {order.customer_name}
            </div>

            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {order.delivery_address}
            </p>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
              <span>{order.destination_sector} • {order.weight_kg}kg</span>
              <span className="flex items-center space-x-1">
                {order.status === 'delivered' ? (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                ) : (
                  <span className="text-cyan-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.assigned_vehicle_id ? 'Assigned' : 'Pending'}</span>
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Order Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm rounded-2xl">
          <div className="bg-slate-900 border border-slate-700 w-full p-4 rounded-xl shadow-2xl flex flex-col relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-3">Add Order & Assign</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="block text-slate-400 mb-1">Customer Name</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.customer_name} onChange={e => setNewOrder({...newOrder, customer_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Customer Phone</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.customer_phone} onChange={e => setNewOrder({...newOrder, customer_phone: e.target.value})} placeholder="e.g. 9845012345" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Delivery Address</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.delivery_address} onChange={e => setNewOrder({...newOrder, delivery_address: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Sector / Zone</label>
                <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.destination_sector} onChange={e => setNewOrder({...newOrder, destination_sector: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Weight (kg)</label>
                  <input required type="number" min="1" className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.weight_kg} onChange={e => setNewOrder({...newOrder, weight_kg: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.priority} onChange={e => setNewOrder({...newOrder, priority: e.target.value as OrderPriority})}>
                    <option value="P1_URGENT">P1_URGENT</option>
                    <option value="P2_EXPRESS">P2_EXPRESS</option>
                    <option value="P3_STANDARD">P3_STANDARD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Assign Delivery Vehicle</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white" value={newOrder.assigned_vehicle_id} onChange={e => setNewOrder({...newOrder, assigned_vehicle_id: e.target.value})}>
                  <option value="">-- Queue (Optimizer) --</option>
                  {vehicles.filter(v => v.status === 'in_transit' || v.status === 'idle').map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.plate_number})</option>
                  ))}
                </select>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded">
                {isSubmitting ? 'Processing...' : 'Create & Assign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
