// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useApp } from '../../contexts/AppContext.jsx'
// import DaumPostcode from 'react-daum-postcode'
// import "../../styles/wizard.css";
//
// export default function AddressPage() {
//     const { userData, setUserData } = useApp()
//     const navigate = useNavigate()
//
//     const [showPostcode, setShowPostcode] = useState(false)
//     const [full, setFull] = useState(userData?.address?.full || '')
//     const [detail, setDetail] = useState(userData?.address?.detail || '')
//     const [regionConfirmed, setRegionConfirmed] = useState(
//         userData?.address?.regionConfirmed ?? null
//     )
//
//     const handleComplete = (data) => {
//         let base = data.address
//         if (data.addressType === 'R') {
//             const parts = [data.bname, data.buildingName].filter(Boolean)
//             if (parts.length) base += ` (${parts.join(', ')})`
//         }
//         setFull(base)
//         setShowPostcode(false)
//         setRegionConfirmed(null) // 새 주소 선택 시 다시 확인 받기
//     }
//
//     const isValid = !!(full && regionConfirmed === true)
//
//     const onSubmit = (e) => {
//         e.preventDefault()
//         if (!isValid) return
//
//         setUserData(prev => ({
//             ...prev,
//             address: {
//                 full,
//                 detail: detail?.trim() || '',
//                 regionConfirmed: true,
//             }
//         }))
//         navigate('/family')
//     }
//
//     return (
//         <div className="page">
//
//             <h2>거주하고 계신 주소를 입력해 주세요.</h2>
//
//             <form onSubmit={onSubmit}>
//                 <div className="address-search">
//                     <input
//                         value={full}
//                         placeholder="주소 검색하기"
//                         onChange={(e) => setFull(e.target.value)}
//                         onFocus={() => setShowPostcode(true)}
//                         readOnly
//                     />
//                     <button type="button" className="icon-btn" onClick={() => setShowPostcode(true)}>🔍</button>
//                 </div>
//
//                 {full && (
//                     <>
//                         <label>상세주소</label>
//                         <input
//                             value={detail}
//                             onChange={(e) => setDetail(e.target.value)}
//                             placeholder="동/호 등 상세주소 (선택)"
//                         />
//
//                         <div className="spacer" />
//
//                         <label>해당 지역에 거주하고 계신가요?</label>
//                         <div className="btn-group">
//                             <button type="button"
//                                     className={`btn ${regionConfirmed === true ? 'btn--primary' : 'btn--ghost'}`}
//                                     onClick={() => setRegionConfirmed(true)}
//                             >예</button>
//                             <button type="button"
//                                     className={`btn ${regionConfirmed === false ? 'btn--primary' : 'btn--ghost'}`}
//                                     onClick={() => setRegionConfirmed(false)}
//                             >아니요</button>
//                         </div>
//                     </>
//                 )}
//
//                 <button type="submit" className="btn btn--primary btn--large" disabled={!isValid}>
//                     다음
//                 </button>
//             </form>
//
//             {showPostcode && (
//                 <div className="modal">
//                     <div className="modal__body">
//                         <DaumPostcode onComplete={handleComplete} />
//                         <button className="btn" onClick={() => setShowPostcode(false)}>닫기</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
//
//
//


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'
import DaumPostcode from 'react-daum-postcode'
import "../../styles/wizard.css"

export default function AddressPage() {
    const { userData, setUserData } = useApp()
    const navigate = useNavigate()

    const [showPostcode, setShowPostcode] = useState(false)
    const [full, setFull] = useState(userData?.address?.full || '')
    const [detail, setDetail] = useState(userData?.address?.detail || '')
    const [regionConfirmed, setRegionConfirmed] = useState(
        userData?.address?.regionConfirmed ?? null
    )

    const handleComplete = (data) => {
        let base = data.address
        if (data.addressType === 'R') {
            const parts = [data.bname, data.buildingName].filter(Boolean)
            if (parts.length) base += ` (${parts.join(', ')})`
        }
        setFull(base)
        setShowPostcode(false)
        setRegionConfirmed(null) // 새 주소 선택 시 다시 확인 받기
    }

    const isValid = !!(full && regionConfirmed === true)

    const onSubmit = (e) => {
        e.preventDefault()
        if (!isValid) return

        setUserData(prev => ({
            ...prev,
            address: {
                full,
                detail: detail?.trim() || '',
                regionConfirmed: true,
            }
        }))
        navigate('/family')
    }

    return (
        <div className="page">
            {/* 상단 헤더: 이전 버튼 포함 */}
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로 가기"
                >
                    ←
                </button>
                <h2>거주하고 계신 주소를 입력해 주세요.</h2>
            </div>

            <form onSubmit={onSubmit}>
                <div className="address-search">
                    <input
                        value={full}
                        placeholder="주소 검색하기"
                        onChange={(e) => setFull(e.target.value)}
                        onFocus={() => setShowPostcode(true)}
                        readOnly
                    />
                    <button type="button" className="icon-btn" onClick={() => setShowPostcode(true)}>🔍</button>
                </div>

                {full && (
                    <>
                        <label>상세주소</label>
                        <input
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            placeholder="동/호 등 상세주소 (선택)"
                        />

                        <div className="spacer" />

                        <label>해당 지역에 거주하고 계신가요?</label>
                        <div className="btn-group">
                            <button type="button"
                                    className={`btn ${regionConfirmed === true ? 'btn--primary' : 'btn--ghost'}`}
                                    onClick={() => setRegionConfirmed(true)}
                            >예</button>
                            <button type="button"
                                    className={`btn ${regionConfirmed === false ? 'btn--primary' : 'btn--ghost'}`}
                                    onClick={() => setRegionConfirmed(false)}
                            >아니오</button>
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn--primary btn--large" disabled={!isValid}>
                    다음
                </button>
            </form>

            {showPostcode && (
                <div className="modal">
                    <div className="modal__body">
                        <DaumPostcode onComplete={handleComplete} />
                        <button className="btn" onClick={() => setShowPostcode(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    )
}
