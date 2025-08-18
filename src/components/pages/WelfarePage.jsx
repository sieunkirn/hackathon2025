// pages/WelfarePage.jsx
import { useApp } from '../../contexts/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import TabHeader from '../common/TabHeader.jsx'
import '../../styles/components.css'

export default function WelfarePage() {
    const { userData } = useApp()
    const navigate = useNavigate()
    const handleGoChatbot = () => navigate('/chatbot')

    const recommendedPolicies = [
        { id: 1, title: '전북 구강보건사업', sub: '구강보건센터', date: '25.12.31(수) 마감', status: '지원 대상' },
        { id: 2, title: '충남 농어가 건강검진 지원', sub: '충청남도', date: '25.11.30(토) 마감', status: '신규' },
    ]

    const goInfo = () => navigate('/info')

    return (
        <div className="welfare-page">
            <TabHeader />

            <div className="content-section">
                <div className="section-header">
                    <div className="title-row">
                        <h2>추천 복지</h2>
                        <span className="count">{recommendedPolicies.length}건</span>
                    </div>
                    <button type="button" className="info-edit" onClick={goInfo}>
                        정보수정 &gt;
                    </button>
                </div>

                <div className="policy-list">
                    {recommendedPolicies.map((p) => (
                        <div className="policy-card recommended" key={p.id}>
                            <img src="/assets/govLogo.png" alt="정부기관" />
                            <div className="policy-info">
                                <p className="policy-title">{p.title}</p>
                                <p className="policy-sub">
                                    {p.sub} | {p.date}
                                </p>
                            </div>
                            <div className="policy-status">{p.status}</div>
                        </div>
                    ))}
                </div>

                {/* 🔽 배너 전체를 버튼으로 변경 */}
                <button
                    type="button"
                    className="info-banner"
                    onClick={goInfo}
                    aria-label="정보를 등록하고 매달 맞춤 복지 알림 받으러 가기"
                >
                    <span>정보 등록하고</span>
                    <span>매달 나에게 맞는 복지 알림 받기</span>
                </button>
                <button className="floating-chatbot" onClick={handleGoChatbot}>
                    <img src="/assets/chatbot.png" alt="챗봇" />
                </button>

            </div>
        </div>
    )
}
