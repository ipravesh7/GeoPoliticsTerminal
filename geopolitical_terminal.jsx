import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Radio, Globe, Zap, DollarSign, Terminal } from 'lucide-react';

const MOCK_INTEL_FEED = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60000),
    sourceType: 'wire_service',
    sourceName: 'BLOOMBERG',
    title: 'OPEC+ EMERGENCY MEETING CALLED - PRODUCTION CUTS EXPECTED',
    content: 'OPEC+ announces emergency meeting to discuss production cuts amid falling oil prices. Saudi Arabia and Russia coordinate response to market volatility. Brent crude futures surge 4.2% on news.',
    url: 'https://bloomberg.com/opec',
    entities: ['OPEC', 'Saudi Arabia', 'Russia'],
    keywords: ['oil', 'production', 'commodities'],
    marketImpact: {
      global_markets: 7.5,
      crypto_markets: 3.2,
      commodities: 9.8,
      overall: 6.83
    },
    sentiment: -0.4
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60000),
    sourceType: 'official_leader',
    sourceName: '@SECGov',
    title: 'SEC ANNOUNCES CRYPTOCURRENCY REGULATORY FRAMEWORK',
    content: 'SEC announces new regulatory framework for cryptocurrency exchanges. Major implications for Binance and Coinbase operations. Compliance deadline set for Q2 2024.',
    url: 'https://twitter.com/SECGov/123',
    entities: ['SEC', 'Binance', 'Coinbase'],
    keywords: ['crypto', 'regulation', 'bitcoin'],
    marketImpact: {
      global_markets: 5.1,
      crypto_markets: 9.6,
      commodities: 1.2,
      overall: 5.3
    },
    sentiment: -0.6
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 8 * 60000),
    sourceType: 'telegram_osint',
    sourceName: 'RYBAR_EN',
    title: 'RUSSIAN MILITARY EXERCISES ESCALATE NEAR UKRAINE BORDER',
    content: 'Russian forces conduct large-scale military exercises near Ukraine border. NATO increases surveillance flights in eastern Europe. Approximately 50,000 troops mobilized for drills.',
    url: 'https://t.me/rybar_en/456',
    entities: ['Russia', 'Ukraine', 'NATO'],
    keywords: ['military', 'conflict', 'oil'],
    marketImpact: {
      global_markets: 8.2,
      crypto_markets: 4.5,
      commodities: 7.8,
      overall: 6.83
    },
    sentiment: -0.8
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 12 * 60000),
    sourceType: 'wire_service',
    sourceName: 'REUTERS',
    title: 'CHINA UNVEILS $1.4T STIMULUS PACKAGE',
    content: 'China announces stimulus package worth $1.4 trillion to boost economy. Focus on infrastructure and technology sectors. Market analysts project 2% GDP growth acceleration.',
    url: 'https://reuters.com/china',
    entities: ['China'],
    keywords: ['gdp', 'stimulus', 'infrastructure'],
    marketImpact: {
      global_markets: 9.1,
      crypto_markets: 6.8,
      commodities: 7.2,
      overall: 7.7
    },
    sentiment: 0.7
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 18 * 60000),
    sourceType: 'isw_assessment',
    sourceName: 'ISW',
    title: 'UKRAINE STRIKES RUSSIAN AMMUNITION DEPOT IN CRIMEA',
    content: 'Ukraine successfully strikes Russian ammunition depot in Crimea. Significant impact on Russian logistics in southern sector. Secondary explosions reported for 6 hours.',
    url: 'https://understandingwar.org/assessment',
    entities: ['Ukraine', 'Russia'],
    keywords: ['military', 'strike', 'conflict'],
    marketImpact: {
      global_markets: 6.4,
      crypto_markets: 3.1,
      commodities: 8.5,
      overall: 6.0
    },
    sentiment: -0.5
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 25 * 60000),
    sourceType: 'wire_service',
    sourceName: 'BLOOMBERG',
    title: 'FED SIGNALS POTENTIAL RATE PAUSE AMID INFLATION CONCERNS',
    content: 'Federal Reserve officials signal potential pause in interest rate hikes. Markets rally on dovish commentary from FOMC members. Treasury yields drop 15 basis points.',
    url: 'https://bloomberg.com/fed',
    entities: ['Fed', 'USA'],
    keywords: ['interest rate', 'inflation', 'fed'],
    marketImpact: {
      global_markets: 9.8,
      crypto_markets: 8.4,
      commodities: 5.6,
      overall: 7.93
    },
    sentiment: 0.6
  }
];

const GeopoliticalTerminal = () => {
  const [feed, setFeed] = useState(MOCK_INTEL_FEED);
  const [filteredFeed, setFilteredFeed] = useState(MOCK_INTEL_FEED);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [filterSource, setFilterSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [scanlines, setScanlines] = useState(true);
  const feedRef = useRef(null);
  const [blinkCursor, setBlinkCursor] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => setBlinkCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newItem = generateMockItem();
      setFeed(prev => [newItem, ...prev.slice(0, 49)]);
    }, 20000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Apply filters
  useEffect(() => {
    let filtered = [...feed];

    if (filterSource !== 'all') {
      filtered = filtered.filter(item => item.sourceType === filterSource);
    }

    if (marketFilter !== 'all') {
      filtered = filtered.filter(item => {
        const impact = item.marketImpact[marketFilter];
        return impact >= 6.0; // High impact threshold
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.entities.some(e => e.toLowerCase().includes(query))
      );
    }

    setFilteredFeed(filtered);
  }, [feed, filterSource, searchQuery, marketFilter]);

  const generateMockItem = () => {
    const templates = [
      { title: 'BREAKING: NEW SANCTIONS PACKAGE TARGETING ENERGY SECTOR', global: 8.2, crypto: 4.1, commodities: 9.5 },
      { title: 'BITCOIN ETF APPROVAL RUMORS CIRCULATE IN CRYPTO MARKETS', global: 5.6, crypto: 9.8, commodities: 2.1 },
      { title: 'WHEAT PRICES SURGE ON BLACK SEA SHIPPING DISRUPTION', global: 6.3, crypto: 1.8, commodities: 9.2 },
      { title: 'CHINA-US TRADE TALKS RESUME AFTER 6-MONTH PAUSE', global: 9.1, crypto: 6.4, commodities: 7.2 },
      { title: 'MAJOR CYBER ATTACK ATTRIBUTED TO STATE-SPONSORED ACTORS', global: 7.8, crypto: 8.5, commodities: 3.2 }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const sources = ['BLOOMBERG', 'REUTERS', 'RYBAR_EN', 'ISW', '@FED'];

    return {
      id: `new_${Date.now()}`,
      timestamp: new Date(),
      sourceType: ['wire_service', 'telegram_osint', 'official_leader'][Math.floor(Math.random() * 3)],
      sourceName: sources[Math.floor(Math.random() * sources.length)],
      title: template.title,
      content: 'Additional intelligence details and analysis...',
      url: `https://source.com/${Date.now()}`,
      entities: ['Russia', 'China', 'USA'][Math.floor(Math.random() * 3)],
      keywords: ['military', 'sanctions', 'crypto'],
      marketImpact: {
        global_markets: template.global,
        crypto_markets: template.crypto,
        commodities: template.commodities,
        overall: (template.global + template.crypto + template.commodities) / 3
      },
      sentiment: Math.random() * 2 - 1
    };
  };

  const getImpactColor = (score) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-orange-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getImpactBar = (score) => {
    const percentage = (score / 10) * 100;
    let color = 'bg-green-500';
    if (score >= 8) color = 'bg-red-500';
    else if (score >= 6) color = 'bg-orange-500';
    else if (score >= 4) color = 'bg-yellow-500';

    return (
      <div className="w-24 h-2 bg-gray-800 border border-gray-700 relative overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const formatTimestamp = (date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  };

  const marketStats = {
    global: filteredFeed.reduce((sum, item) => sum + item.marketImpact.global_markets, 0) / filteredFeed.length || 0,
    crypto: filteredFeed.reduce((sum, item) => sum + item.marketImpact.crypto_markets, 0) / filteredFeed.length || 0,
    commodities: filteredFeed.reduce((sum, item) => sum + item.marketImpact.commodities, 0) / filteredFeed.length || 0
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      {scanlines && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.15), rgba(0, 255, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          }}
        />
      )}

      {/* CRT screen glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black opacity-30 z-40" />

      {/* Header */}
      <div className="border-b-2 border-green-600 bg-black/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                GEOINT TERMINAL
              </h1>
              <div className="text-xs text-green-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                GLOBAL INTELLIGENCE MONITORING SYSTEM v2.1.4
                <span className="ml-2">●</span>
                {isLive ? (
                  <span className="text-red-400 animate-pulse">● LIVE</span>
                ) : (
                  <span className="text-gray-500">○ PAUSED</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 border-2 font-bold text-xs tracking-wider ${
                isLive 
                  ? 'border-red-500 text-red-400 hover:bg-red-500/10' 
                  : 'border-gray-600 text-gray-400 hover:bg-gray-600/10'
              }`}
            >
              {isLive ? '[STREAMING]' : '[PAUSED]'}
            </button>
          </div>

          {/* Market Impact Summary */}
          <div className="grid grid-cols-3 gap-4 text-xs mb-3">
            <div className="border border-green-700 bg-black/50 p-2">
              <div className="text-gray-400 mb-1">GLOBAL MARKETS</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${getImpactColor(marketStats.global)}`}>
                  {marketStats.global.toFixed(1)}
                </span>
                {getImpactBar(marketStats.global)}
              </div>
            </div>
            <div className="border border-green-700 bg-black/50 p-2">
              <div className="text-gray-400 mb-1">CRYPTO MARKETS</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${getImpactColor(marketStats.crypto)}`}>
                  {marketStats.crypto.toFixed(1)}
                </span>
                {getImpactBar(marketStats.crypto)}
              </div>
            </div>
            <div className="border border-green-700 bg-black/50 p-2">
              <div className="text-gray-400 mb-1">COMMODITIES</div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${getImpactColor(marketStats.commodities)}`}>
                  {marketStats.commodities.toFixed(1)}
                </span>
                {getImpactBar(marketStats.commodities)}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <input
                type="text"
                placeholder="> SEARCH_QUERY_"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-green-700 px-2 py-1.5 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500"
              />
            </div>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-black border border-green-700 px-2 py-1.5 text-green-400 focus:outline-none focus:border-green-500"
            >
              <option value="all">[ALL_SOURCES]</option>
              <option value="wire_service">[WIRE_SERVICES]</option>
              <option value="telegram_osint">[OSINT_CHANNELS]</option>
              <option value="official_leader">[OFFICIAL_FEEDS]</option>
              <option value="isw_assessment">[ISW_REPORTS]</option>
            </select>
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="bg-black border border-green-700 px-2 py-1.5 text-green-400 focus:outline-none focus:border-green-500"
            >
              <option value="all">[ALL_MARKETS]</option>
              <option value="global_markets">[GLOBAL_HIGH_IMPACT]</option>
              <option value="crypto_markets">[CRYPTO_HIGH_IMPACT]</option>
              <option value="commodities">[COMMODITIES_HIGH_IMPACT]</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 gap-4">
        {/* Main Feed */}
        <div className="col-span-2">
          <div className="border-2 border-green-700 bg-black/80 p-3 mb-2">
            <div className="text-xs text-green-600">
              {`> INTELLIGENCE_STREAM.exe --source=MULTI --format=RAW`}
              <span className={blinkCursor ? 'opacity-100' : 'opacity-0'}>█</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ACTIVE_ITEMS: {filteredFeed.length} | SOURCES: 50+ | LATENCY: 2.3ms
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto" ref={feedRef}>
            {filteredFeed.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`border-2 bg-black/60 p-3 cursor-pointer hover:bg-green-950/20 transition ${
                  selectedItem?.id === item.id ? 'border-green-400' : 'border-green-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>[{formatTimestamp(item.timestamp)}]</span>
                    <span className="text-green-600">●</span>
                    <span className="text-green-500">{item.sourceName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">IMPACT:</span>
                    <span className={`font-bold ${getImpactColor(item.marketImpact.overall)}`}>
                      {item.marketImpact.overall.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-green-300 font-bold mb-2 leading-tight">
                  {item.title}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">GLB:</span>
                    <span className={`ml-1 font-bold ${getImpactColor(item.marketImpact.global_markets)}`}>
                      {item.marketImpact.global_markets.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">CRY:</span>
                    <span className={`ml-1 font-bold ${getImpactColor(item.marketImpact.crypto_markets)}`}>
                      {item.marketImpact.crypto_markets.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">CMD:</span>
                    <span className={`ml-1 font-bold ${getImpactColor(item.marketImpact.commodities)}`}>
                      {item.marketImpact.commodities.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  {item.entities.map((entity, i) => (
                    <span key={i} className="bg-green-950/50 border border-green-800 px-1.5 py-0.5 text-green-400">
                      {entity.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {selectedItem && (
            <div className="border-2 border-green-700 bg-black/80 p-3">
              <div className="text-xs text-green-600 mb-2">
                {'> ITEM_DETAILS.log'}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-500">ID:</div>
                  <div className="text-green-400 font-mono">{selectedItem.id}</div>
                </div>

                <div>
                  <div className="text-gray-500">SOURCE:</div>
                  <div className="text-green-400">{selectedItem.sourceName}</div>
                </div>

                <div>
                  <div className="text-gray-500">TIMESTAMP:</div>
                  <div className="text-green-400">{formatTimestamp(selectedItem.timestamp)}</div>
                </div>

                <div>
                  <div className="text-gray-500">CONTENT:</div>
                  <div className="text-green-300 text-xs leading-relaxed mt-1">
                    {selectedItem.content}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">MARKET_IMPACT:</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">GLOBAL:</span>
                      <div className="flex items-center gap-2">
                        {getImpactBar(selectedItem.marketImpact.global_markets)}
                        <span className={`font-bold ${getImpactColor(selectedItem.marketImpact.global_markets)}`}>
                          {selectedItem.marketImpact.global_markets.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">CRYPTO:</span>
                      <div className="flex items-center gap-2">
                        {getImpactBar(selectedItem.marketImpact.crypto_markets)}
                        <span className={`font-bold ${getImpactColor(selectedItem.marketImpact.crypto_markets)}`}>
                          {selectedItem.marketImpact.crypto_markets.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">COMMODITIES:</span>
                      <div className="flex items-center gap-2">
                        {getImpactBar(selectedItem.marketImpact.commodities)}
                        <span className={`font-bold ${getImpactColor(selectedItem.marketImpact.commodities)}`}>
                          {selectedItem.marketImpact.commodities.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">SENTIMENT:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-800 border border-gray-700 h-2">
                      <div
                        className={`h-full ${selectedItem.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{
                          width: `${Math.abs(selectedItem.sentiment) * 50}%`,
                          marginLeft: selectedItem.sentiment < 0 ? '50%' : '0'
                        }}
                      />
                    </div>
                    <span className={selectedItem.sentiment > 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedItem.sentiment > 0 ? '+' : ''}{selectedItem.sentiment.toFixed(2)}
                    </span>
                  </div>
                </div>

                {selectedItem.url && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-green-700 px-2 py-1 text-center hover:bg-green-950/30 text-green-400"
                  >
                    [VIEW_SOURCE]
                  </a>
                )}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="border-2 border-green-700 bg-black/80 p-3">
            <div className="text-xs text-green-600 mb-2">
              {'> SYSTEM_STATUS.log'}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>UPTIME:</span>
                <span className="text-green-400">99.98%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>SOURCES:</span>
                <span className="text-green-400">52 ACTIVE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>LATENCY:</span>
                <span className="text-green-400">2.3ms</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>ITEMS/HR:</span>
                <span className="text-green-400">~180</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>STATUS:</span>
                <span className="text-green-400 animate-pulse">NOMINAL</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="border-2 border-green-700 bg-black/80 p-3">
            <div className="text-xs text-green-600 mb-2">
              {'> IMPACT_SCALE.ref'}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500" />
                <span className="text-gray-400">8.0-10.0 CRITICAL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500" />
                <span className="text-gray-400">6.0-7.9 HIGH</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500" />
                <span className="text-gray-400">4.0-5.9 MEDIUM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500" />
                <span className="text-gray-400">0.0-3.9 LOW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeopoliticalTerminal;