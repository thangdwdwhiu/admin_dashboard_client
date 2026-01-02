import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PageNotFound from '../PageNotFound/PageNotFound'
import { Users, UserCheck, UserX, PieChart as PieIcon } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getStats } from '../../features/statsSlice'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'

// Màu cho biểu đồ
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DashBoard() {
    const dispatch = useDispatch()
    const {loading, error, stats} = useSelector((state) => state.stats)
    const { user } = useSelector((s) => s.user)
    const navigate = useNavigate()

    useEffect(() => {
       
        if (!user || user.role_id === 3) {
            return
        }

        const fetchStats = async () => {
                dispatch(getStats())
        }

        fetchStats()
        if (error) {
            toast.error(error)
        }
    }, [user])

    if (!user || user.role_id === 3) return <PageNotFound />

    if (loading) return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Loading text='Đang tải dữ liệu'  size='normal' />
        </div>
    )

    return (
        <div className="p-4" style={{ minHeight: '70vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, textShadow: "1px 5px gray"}}>DASHBOARD</h1>
                <button
                    onClick={() => navigate('/user-management')}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 8, padding: '8px 12px', boxShadow: '0 6px 18px rgba(2,6,23,0.08)' }}
                >
                    Quản lý người dùng
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                <StatCard title="Tổng User" value={stats.summary.total} icon={<Users size={24} className="text-blue-600" />} color="#e6f6ff" />
                <StatCard title="Đang Hoạt Động" value={stats.summary.active} icon={<UserCheck size={24} className="text-green-600" />} color="#ecfff3" />
                <StatCard title="Đã Bị Khóa" value={stats.summary.blocked} icon={<UserX size={24} className="text-red-600" />} color="#fff1f1" />
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 6px 20px rgba(2,6,23,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <PieIcon size={18} />
                    <h2 style={{ margin: 0, fontSize: 16 }}>Tỷ lệ Người dùng theo Vai trò</h2>
                </div>

                <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stats.chart && stats.chart.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats.chart} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                                    {stats.chart.map((entry, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v} người`, 'Số lượng']} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ color: '#666' }}>Chưa có dữ liệu</div>
                    )}
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon, color }) => (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 20px rgba(2,6,23,0.06)' }}>
        <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>{value}</h3>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: 999, display: 'grid', placeItems: 'center', background: color }}>
            {icon}
        </div>
    </div>
)