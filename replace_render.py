import sys

with open('client/src/pages/MvpMap.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')

# 990번째 줄(0-indexed: 989)부터 끝까지 교체
# 989번째 줄은 빈 줄, 990번째 줄은 "  // 스플래시 화면"
keep_lines = lines[:989]  # 0~988번째 줄 (1~989번째 줄) 유지

new_render = '''
  // 스플래시 화면
  if (screen === "splash") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          height: `${screenHeight}px`,
          background: '#F5F0E8',
          opacity: splashFading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: '52px',
            color: '#2C1810',
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          SPOT
        </h1>
      </div>
    );
  }

  // 홈 화면 (지역 선택)
  if (screen === "home") {
    return (
      <div
        className="fixed inset-0 flex flex-col"
        style={{ height: `${screenHeight}px`, background: '#F5F0E8' }}
      >
        <Toaster position="top-center" />

        {/* 이벤트 배너 */}
        <div
          className="flex flex-col items-center justify-center px-4 py-3 text-center"
          style={{
            background: '#F5F0E8',
            borderBottom: '1px solid #E0D8CC',
            minHeight: '56px'
          }}
        >
          {hongdaeData?.AREA_CONGEST_LVL ? (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810', lineHeight: 1.4 }}>
                🔥 지금 홍대 혼잡도: <span style={{ color: hongdaeData.AREA_CONGEST_LVL.includes('붐빔') ? '#E53E3E' : '#D69E2E' }}>{hongdaeData.AREA_CONGEST_LVL}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#6B5B4E', marginTop: '2px' }}>
                실시간 서울시 데이터
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810' }}>
                🔥 일일 수작 홍대입구역점 이벤트 진행(4/12~4/20)🔥
              </div>
              <div style={{ fontSize: '12px', color: '#6B5B4E', marginTop: '2px' }}>
                2만원 이상 구매시 산리오 키링 증정
              </div>
            </>
          )}
        </div>

        {/* 안내 텍스트 */}
        <div
          className="flex items-center justify-center px-6 py-4"
          style={{ fontSize: '14px', fontWeight: 600, color: '#2C1810', textAlign: 'center' }}
        >
          해당 지역 클릭시 해당 지역만의 지도 노출
        </div>

        {/* 지역 선택 버튼 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
          {/* 연남 - 큰 버튼 */}
          <button
            onClick={() => {
              setSelectedCity('연남');
              setScreen('map');
              setTimeout(() => setMapVisible(true), 50);
            }}
            className="w-full"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #2C1810',
              borderRadius: '4px',
              padding: '28px 24px',
              fontSize: '22px',
              fontWeight: 700,
              color: '#2C1810',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F0EBE0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
          >
            연남
          </button>

          {/* 홍대 + 성수 - 2열 */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => {
                setSelectedCity('홍대');
                setScreen('map');
                setTimeout(() => setMapVisible(true), 50);
              }}
              className="flex-1"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #2C1810',
                borderRadius: '4px',
                padding: '28px 24px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#2C1810',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EBE0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
            >
              홍대
            </button>
            <button
              onClick={() => {
                setSelectedCity('성수');
                setScreen('map');
                setTimeout(() => setMapVisible(true), 50);
              }}
              className="flex-1"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #2C1810',
                borderRadius: '4px',
                padding: '28px 24px',
                fontSize: '22px',
                fontWeight: 700,
                color: '#2C1810',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EBE0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
            >
              성수
            </button>
          </div>

          {/* 통합 검색 안내 */}
          <div
            className="text-center"
            style={{ fontSize: '13px', color: '#6B5B4E', marginTop: '8px', lineHeight: 1.6 }}
          >
            홍대+성수+연남<br />
            통합 지도 내 장소 검색
          </div>
        </div>

        {/* 하단 탭바 - 3개 */}
        <div
          className="flex items-center justify-around px-4"
          style={{
            background: '#F5F0E8',
            borderTop: '1px solid #E0D8CC',
            height: '72px',
            flexShrink: 0
          }}
        >
          {/* 지도 탭 (현재 활성) */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>지도</span>
          </button>

          {/* 검색 탭 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880' }}
            onClick={() => setShowSearch(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>검색</span>
          </button>

          {/* 프로필 탭 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>프로필</span>
          </button>
        </div>
      </div>
    );
  }

  // 지도 화면
  const currentCity = selectedCity || '홍대';
  const currentCityData = currentCity === '홍대' ? hongdaeData : currentCity === '성수' ? seongsuData : yeonnamData;
  const congestionLevel = currentCityData?.AREA_CONGEST_LVL || '';
  const congestionAge = currentCityData?.AREA_PPLTN_MIN ? `${currentCityData.AREA_PPLTN_MIN}~${currentCityData.AREA_PPLTN_MAX}명` : '';

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        height: `${screenHeight}px`,
        background: '#F5F0E8',
        opacity: mapVisible ? 1 : 0,
        transition: 'opacity 0.35s ease'
      }}
    >
      <Toaster position="top-center" />

      {/* 상단 헤더 */}
      <div
        className="flex items-center px-4 py-2"
        style={{
          background: '#F5F0E8',
          borderBottom: '1.5px solid #2C1810',
          flexShrink: 0,
          minHeight: '48px'
        }}
      >
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => { setScreen('home'); setMapVisible(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px', padding: '4px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>{currentCity}</div>

        {congestionLevel && (
          <div
            className="flex items-center gap-1 ml-2"
            style={{ fontSize: '12px', color: '#6B5B4E', fontWeight: 600 }}
          >
            <span># 혼잡도: {congestionLevel.includes('붐빔') ? 'S' : congestionLevel.includes('보통') ? 'M' : 'L'}</span>
            {congestionAge && <span># {congestionAge}</span>}
          </div>
        )}
        {!congestionLevel && (
          <div style={{ fontSize: '12px', color: '#A89880', marginLeft: '8px' }}>
            # 혼잡도: S  #20대 압도적
          </div>
        )}
      </div>

      {/* 카카오맵 컨테이너 */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" style={{ background: '#E8E0D0' }} />

        {/* 카카오맵 로드 실패 시 폴백 */}
        {!mapRef.current && screen === 'map' && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: '#E8E0D0', color: '#A89880', fontSize: '13px', textAlign: 'center' }}
          >
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
              <div>지도를 불러오는 중...</div>
            </div>
          </div>
        )}

        {/* 검색 패널 */}
        {showSearch && (
          <div
            ref={searchPanelRef}
            className="absolute top-2 left-2 right-2 z-30 rounded-lg overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #2C1810',
              boxShadow: '0 4px 16px rgba(44,24,16,0.15)',
              opacity: searchVisible ? 1 : 0,
              transform: searchVisible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.18s ease, transform 0.18s ease'
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="장소·지역 검색 (예: 홍대 카페)"
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: '#2C1810' }}
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                style={{ color: '#A89880', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >✕</button>
            </div>
            {searchLoading && <div className="px-3 py-3 text-center text-sm" style={{ color: '#A89880' }}>검색 중...</div>}
            {!searchLoading && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2.5 text-sm"
                    style={{ color: '#2C1810', borderBottom: idx < searchResults.length - 1 ? '1px solid #F0EBE0' : 'none', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setCenter(new window.kakao.maps.LatLng(result.lat, result.lng));
                        mapRef.current.setLevel(4);
                        toast.success(`📍 ${result.name}`, { duration: 2000 });
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }
                    }}
                  >
                    📍 {result.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 업종&목적 필터 패널 (8.png) */}
        {showFilter && (
          <div
            className="absolute bottom-0 left-0 right-0 z-40"
            style={{
              background: '#B2DFDB',
              border: '1.5px solid #2C1810',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '16px',
              opacity: filterVisible ? 1 : 0,
              transform: filterVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}
          >
            {/* 업종 */}
            <div className="flex gap-2 mb-3">
              {['카페', '술집', '팝업', '전시'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilterCategory(prev => prev === cat ? null : cat)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: selectedFilterCategory === cat ? '#E53E3E' : '#E53E3E',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* 목적 */}
            <div style={{ borderTop: '1.5px solid #2C1810', paddingTop: '12px' }}>
              <div className="flex flex-wrap gap-2">
                {['#데이트', '#카공', '#작업', '#친목', '#식사', '#술', '#쇼핑', '#구경'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedFilterPurpose(prev => prev === tag ? null : tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: selectedFilterPurpose === tag ? '#F6E05E' : '#F6E05E',
                      color: '#2C1810',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {/* 닫기 화살표 */}
            <div className="flex justify-center mt-3">
              <button
                onClick={() => { setFilterVisible(false); setTimeout(() => setShowFilter(false), 200); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 팝업 카드 (3/4.png 스타일) */}
      {popupData && (() => {
        const activity = popupData.activity || getRandomActivity(popupData.category);
        return (
          <div
            className="absolute z-50"
            style={{
              bottom: '80px',
              left: '12px',
              right: '12px',
              background: '#FFFFFF',
              border: '1.5px solid #2C1810',
              borderRadius: '4px',
              opacity: popupVisible ? 1 : 0,
              transform: popupVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            {/* 헤더 행 */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: '1px solid #E0D8CC' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810' }}>{popupData.mbti}</span>
              <span style={{ fontSize: '12px', color: '#6B5B4E' }}>|</span>
              <span style={{ fontSize: '12px', color: '#6B5B4E' }}>{popupData.placeName || '홍대점'}</span>
              <span style={{ fontSize: '11px', color: '#A89880', marginLeft: 'auto' }}>
                {popupData.createdAt ? `${Math.floor((Date.now() - popupData.createdAt) / 60000)}분전` : '방금'}
              </span>
              <button
                onClick={() => { setPopupVisible(false); setTimeout(() => setPopupData(null), 220); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', fontSize: '14px', marginLeft: '4px' }}
              >✕</button>
            </div>

            {/* 사진/동영상 2칸 */}
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #E0D8CC', minHeight: '100px' }}>
              <div
                className="flex items-center justify-center"
                style={{ borderRight: '1px solid #E0D8CC', padding: '20px', color: '#A89880', fontSize: '13px', background: '#F5F0E8' }}
              >
                사진OR동영상
              </div>
              <div
                className="flex items-center justify-center"
                style={{ padding: '20px', color: '#A89880', fontSize: '13px', background: '#F5F0E8' }}
              >
                사진OR동영상
              </div>
            </div>

            {/* 분위기 태그 */}
            <div className="px-3 py-2.5">
              <div style={{ fontSize: '12px', color: '#2C1810', lineHeight: 1.6 }}>
                {popupData.hashtags?.slice(0, 3).map((tag, i) => (
                  <div key={i}>#{i+1}({i === 0 ? '현재 분위기' : i === 1 ? '체류감' : '주의사항'}): {tag}</div>
                )) || (
                  <>
                    <div>#1(현재 분위기): EX.)커플 비중 높음/ 작업가능</div>
                    <div>#2(체류감): EX.)회전 느림/오래 앉기가능</div>
                    <div>#3(주의사항): EX.)주차불편/웨이팅</div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 하단 네비게이션 바 - 5개 (PNG 스타일) */}
      <div
        className="flex items-center justify-around px-2"
        style={{
          background: '#F5F0E8',
          borderTop: '1.5px solid #2C1810',
          height: '72px',
          flexShrink: 0
        }}
      >
        {/* 채팅 (오늘의 홍대) */}
        <button
          onClick={() => setShowCommunityFeed(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>채팅</span>
        </button>

        {/* 탐색 (필터) */}
        <button
          onClick={() => { setShowFilter(true); setTimeout(() => setFilterVisible(true), 10); }}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="6" r="2" /><circle cx="11" cy="12" r="2" /><circle cx="11" cy="18" r="2" />
            <line x1="16" y1="6" x2="22" y2="6" /><line x1="16" y1="12" x2="22" y2="12" /><line x1="16" y1="18" x2="22" y2="18" />
            <line x1="2" y1="6" x2="6" y2="6" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="2" y1="18" x2="6" y2="18" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>탐색</span>
        </button>

        {/* SPOT 등록 (중앙 강조) */}
        <button
          onClick={() => setShowSpotForm(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#2C1810',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-14px',
              boxShadow: '0 2px 8px rgba(44,24,16,0.3)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 600, color: '#2C1810' }}>SPOT</span>
        </button>

        {/* 검색 */}
        <button
          onClick={() => setShowSearch(prev => !prev)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: showSearch ? '#2C1810' : '#A89880', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>검색</span>
        </button>

        {/* 즐겨찾기 (지금이순간) */}
        <button
          onClick={() => setShowMomentReport(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>이순간</span>
        </button>
      </div>

      {/* GPS 동의 팝업 */}
      {showConsentPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(44,24,16,0.5)', opacity: consentVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}
        >
          <div
            style={{
              background: '#F5F0E8',
              border: '1.5px solid #2C1810',
              borderRadius: '12px',
              padding: '24px',
              width: '300px',
              maxWidth: '90vw',
              transform: consentVisible ? 'scale(1)' : 'scale(0.92)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            <div className="text-center mb-4">
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#2C1810', marginBottom: '6px' }}>위치 정보 사용</div>
              <div style={{ fontSize: '12px', color: '#6B5B4E', lineHeight: 1.6 }}>내 주변 MBTI를 보려면 위치 정보가 필요해요. 정확한 위치는 공유되지 않아요.</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: '#E0D8CC', border: '1px solid #C0B8AC', color: '#6B5B4E', cursor: 'pointer' }}
              >나중에</button>
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 py-2.5 rounded-lg text-sm font-black"
                style={{ background: '#2C1810', border: '1.5px solid #2C1810', color: '#F5F0E8', cursor: 'pointer' }}
              >동의</button>
            </div>
          </div>
        </div>
      )}

      {/* 스팟 등록 폼 (6.png 스타일) */}
      {showSpotForm && !spotSubmitted && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(44,24,16,0.4)', opacity: spotFormVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}
        >
          <div
            style={{
              background: '#F5F0E8',
              border: '1.5px solid #2C1810',
              borderRadius: '12px 12px 0 0',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '88vh',
              overflowY: 'auto',
              transform: spotFormVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            {/* 헤더 */}
            <div
              className="flex items-center px-4 py-3"
              style={{ borderBottom: '1px solid #E0D8CC' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810' }}>@{spotFormData.mbti || 'Min._.jeong'}</span>
            </div>

            {/* ACTIVITY 선택 */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <div style={{ fontSize: '12px', color: '#6B5B4E', marginBottom: '8px' }}>
                #ACTIVITY: 직접 입력이 아닌 선택하게끔(타인에게 공유X, 거시적인 정보에서만 반영)
              </div>
              <div className="flex flex-wrap gap-2">
                {ACTION_FORM_LIST.map(action => (
                  <button
                    key={action.text}
                    onClick={() => setSpotFormData(prev => ({ ...prev, activity: action.text, activityEmoji: action.emoji }))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: spotFormData.activity === action.text ? '#2C1810' : '#FFFFFF',
                      border: '1px solid #2C1810',
                      color: spotFormData.activity === action.text ? '#F5F0E8' : '#2C1810',
                      cursor: 'pointer'
                    }}
                  >
                    {action.emoji} {action.text}
                  </button>
                ))}
              </div>
            </div>

            {/* MBTI 선택 */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <div style={{ fontSize: '12px', color: '#6B5B4E', marginBottom: '8px' }}>MBTI</div>
              <div className="flex flex-wrap gap-1.5">
                {MBTI_TYPES.map(mbti => (
                  <button
                    key={mbti}
                    onClick={() => setSpotFormData(prev => ({ ...prev, mbti }))}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: spotFormData.mbti === mbti ? '#2C1810' : '#FFFFFF',
                      border: '1px solid #2C1810',
                      color: spotFormData.mbti === mbti ? '#F5F0E8' : '#2C1810',
                      cursor: 'pointer'
                    }}
                  >
                    {mbti}
                  </button>
                ))}
              </div>
            </div>

            {/* 사진/동영상 업로드 영역 */}
            <div
              className="flex items-center justify-center px-4 py-8"
              style={{ borderBottom: '1px solid #E0D8CC', color: '#A89880', fontSize: '14px', textAlign: 'center', background: '#F5F0E8' }}
            >
              해당 위치의 사진과 동영상을 올리고<br />
              사람들과 공유해봐요.
            </div>

            {/* 게시/취소 버튼 */}
            <div className="flex items-center justify-around px-8 py-4">
              <button
                onClick={async () => {
                  if (!spotFormData.mbti) { toast.error("MBTI를 선택해주세요"); return; }
                  const loc = userLocation || HONGDAE_CENTER;
                  try {
                    await submitSpot.mutateAsync({
                      mbti: spotFormData.mbti,
                      mood: spotFormData.mood || "CHILL",
                      mode: spotFormData.mode || "산책 중",
                      sign: spotFormData.sign || "👋 말 걸어도 돼요",
                      lat: loc.lat,
                      lng: loc.lng,
                      avatar: serializeAvatar(spotFormData.avatar),
                    });
                    setSpotSubmitted(true);
                    setShowSpotForm(false);
                    toast.success("🎉 SPOT이 등록되었어요!", { duration: 3000 });
                    refetchSpots();
                  } catch (e) {
                    toast.error("등록에 실패했어요. 다시 시도해주세요.");
                  }
                }}
                disabled={submitSpot.isPending}
                style={{
                  padding: '10px 32px',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: '#F6E05E',
                  border: 'none',
                  color: '#2C1810',
                  cursor: 'pointer'
                }}
              >
                {submitSpot.isPending ? '게시 중...' : '게시'}
              </button>
              <button
                onClick={() => setShowSpotForm(false)}
                style={{
                  padding: '10px 32px',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: '#6B5B4E',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지금 이순간 AI 리포트 (7.png) */}
      {showMomentReport && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: '#F5F0E8', height: `${screenHeight}px` }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center px-4 py-3"
            style={{ borderBottom: '1.5px solid #2C1810', flexShrink: 0 }}
          >
            <button
              onClick={() => setShowMomentReport(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>지금 이순간의 {currentCity}는</div>
          </div>

          {/* 리포트 내용 */}
          <div className="flex-1 overflow-y-auto">
            {currentCityData ? (
              <div>
                {/* #1 현재 분위기 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #1 오늘 {currentCity}는 한 곳에 오래 머무는 분위기 보다, 팝업/편집숍을 짧게 들리고 빠르게 이동하는 흐름이 강합니다.
                  </div>
                </div>
                {/* #2 추천행동 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #2 오늘은 날씨가 좋아서 초저녁에는 팝업 1곳과 골목 산책을 묶은 2~3곳 동선으로 움직이는 편이 가장 만족스러울것 같아요
                  </div>
                </div>
                {/* #3 비추천행동 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #3 정교하게 예약 중심으로 짜는 일정이나, 한 장소에 모든 기대를 거는 계획은 비추천입니다.
                  </div>
                </div>
                {/* #4 실시간 변수 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #4 메인 상권 쪽은 순간 체류가 높고, 사진 촬영/쇼핑 후 다음 장소로 넘어가는 흐름이 빠른 편입니다.
                    {currentCityData.AREA_CONGEST_LVL && (
                      <span style={{ color: '#E53E3E', fontWeight: 700 }}> 현재 혼잡도: {currentCityData.AREA_CONGEST_LVL}</span>
                    )}
                  </div>
                </div>
                {/* #5 한줄 평 */}
                <div className="px-4 py-4">
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #5 총정리: 오늘 {currentCity}는 '계획형 코스'보다 '짧고 선명한 즉흥 코스'가 더 잘 맞습니다.<br />
                    (추천): 마음먹고 길게 있기 보다는 3시간 이내의 체류를 추천해요!
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40" style={{ color: '#A89880', fontSize: '14px' }}>
                실시간 데이터를 불러오는 중...
              </div>
            )}
          </div>
        </div>
      )}

      {/* 오늘의 홍대 커뮤니티 피드 (9.png) */}
      {showCommunityFeed && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: '#F5F0E8', height: `${screenHeight}px` }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center px-4 py-3"
            style={{ borderBottom: '1.5px solid #2C1810', flexShrink: 0 }}
          >
            <button
              onClick={() => setShowCommunityFeed(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>오늘의 {currentCity}</div>
          </div>

          {/* 피드 목록 */}
          <div className="flex-1 overflow-y-auto">
            {[
              { user: `@min._.jeong`, text: `${currentCity}입구역 7번 출구 산리오 팝업 스토어 이벤트로 구경만 해도 산리오 키링 주고 있습니다!!!`, isAd: false },
              { user: `(광고)@일일수작 ${currentCity}점`, text: `4월13일 오늘 단 하루만 양주 주문시 3만원 단가의 짬뽕탕+감자튀김 무료!`, isAd: true },
              { user: `@kihyun03`, text: `한신포차 앞에 경찰차 있던대 무슨일임?`, isAd: false },
              { user: `@lovely_minju`, text: `지금 ${currentCity}입구역 근처 카공 가능한 곳 추천좀`, isAd: false },
              { user: `@Auhyun._.:`, text: `외국인 웰캐 많나 진짜로;;;.`, isAd: false },
              { user: `@nayeonyiayo`, text: `실시간 ${currentCity} 카리나 등장.`, isAd: false },
              { user: `@zkdfwe`, text: `pastapia<<<여기 파스타 되게 ㄱㅊ은듯.`, isAd: false },
              { user: `(광고)@PASTA IN HD`, text: `${currentCity} 1등 파스타집 파스타 인 ${currentCity}`, isAd: true },
              { user: `@stron_minsu`, text: `메가커피 ${currentCity}점 지금 아아 1+1이래요.`, isAd: false },
              { user: `@04_02_subin`, text: `${currentCity}입구역 7번 출구에 번따남있어요조심하세요.`, isAd: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-3 text-center"
                style={{
                  borderBottom: '1px solid #E0D8CC',
                  fontSize: '14px',
                  color: item.isAd ? '#6B5B4E' : '#2C1810',
                  lineHeight: 1.5
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.user}</span>: {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
'''

# 989번째 줄(0-indexed)부터 교체
new_lines = keep_lines + new_render.split('\n')
new_content = '\n'.join(new_lines)

with open('client/src/pages/MvpMap.tsx', 'w') as f:
    f.write(new_content)

print(f"Done. New total lines: {len(new_content.split(chr(10)))}")
