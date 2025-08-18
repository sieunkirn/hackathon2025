// src/components/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'
import TabHeader from '../common/TabHeader.jsx'
import '../../styles/components.css'

export default function HomePage() {
    const { userData } = useApp()
    const navigate = useNavigate()

    // 정보 입력/수정
    const handleInfoEdit = () => navigate('/info')

    // 추천복지 카드 → 정책 상세로 이동
    const handleGoPolicy = () => navigate('/policy')

    // 챗봇 플로팅 버튼
    const handleGoChatbot = () => navigate('/chatbot')

    // 데모 데이터 (많이 본 정책 / 신규 정책)
    const policies = [
        { id: 1, title: '전북 구강보건사업', sub: '구강보건센터', date: '25.12.31(수) 마감' },
        { id: 2, title: '충남 농어가 건강검진 지원', sub: '충청남도', date: '25.11.30(토) 마감' },
        { id: 3, title: '서울 청년월세 지원', sub: '서울특별시', date: '상시' },
    ]

    return (
        <div className="home-page">
            <TabHeader />

            {/* 추천 복지 카드 */}
            {/* ✅ 클릭 시 /policy 이동 */}
            <div
                className="recommend-card"
                onClick={handleGoPolicy}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleGoPolicy()
                    }
                }}
                style={{ cursor: 'pointer' }}
            >
                <div className="recommend-header">
                    <span className="recommend-title">추천 복지</span>
                    <button
                        type="button"
                        className="info-edit"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleInfoEdit()
                        }}
                    >
                        정보수정 &gt;
                    </button>
                </div>
                <p className="recommend-count">{userData?.recommendedCount ?? 2}건</p>
            </div>

            {/* 많이 본 정책 */}
            <section className="policy-section" onClick={handleGoPolicy} >
                <h3>많이 본 정책</h3>
                {policies.map((p) => (
                    <div className="policy-card" key={p.id}>
                        <img src="/assets/govLogo.png" alt="기관 로고" />
                        <div>
                            <p className="policy-title">{p.title}</p>
                            <p className="policy-sub">{p.sub}</p>
                            <p className="policy-date">{p.date}</p>
                        </div>
                    </div>
                ))}

                {/* 정보 등록 CTA */}
                <div
                    className="alert-card"
                    role="button"
                    tabIndex={0}
                    onClick={handleInfoEdit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleInfoEdit()
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <p className="alert-title">정보 등록하고</p>
                    <p>매달 나에게 맞는 복지 알림 받기</p>
                </div>
            </section>

            {/* 신규 정책 */}
            <section className="policy-section">
                <h3>신규 정책</h3>
                {policies.map((p) => (
                    <div className="policy-card" key={`new-${p.id}`}  onClick={handleGoPolicy}>
                        <img src="/assets/govLogo.png" alt="기관 로고" />
                        <div>
                            <p className="policy-title">{p.title}</p>
                            <p className="policy-sub">{p.sub}</p>
                            <p className="policy-date">{p.date}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* 챗봇 플로팅 버튼 */}
            <button className="floating-chatbot" onClick={handleGoChatbot} aria-label="챗봇 열기">
                <img src="/assets/chatbot.png" alt="챗봇" />
            </button>
        </div>
    )
}
