/**
 * 工程测量 - 全部知识点与题库数据
 * 安徽农业大学专升本考试大纲（模块1-9）
 */
const SurveyingData = {

  // ==================== 知识点库 ====================
  knowledgePoints: [
    // 模块1 绪论
    { id:'CL-001', chapter:'模块1 绪论', title:'测量学的任务与分类', difficulty:1,
      content:'测量学是研究地球形状和大小以及确定地面点位的科学。分类：大地测量学、普通测量学、摄影测量学、工程测量学。测量工作原则：先控制后碎部、先整体后局部。',
      formula:null, keywords:['测量学','分类','原则'], examWeight:3 },
    { id:'CL-002', chapter:'模块1 绪论', title:'地面点位的确定', difficulty:2,
      content:'大地水准面：平均海水面向陆地延伸形成的闭合曲面。高程：地面点到大地水准面的铅垂距离（绝对高程）。坐标系统：大地坐标系（经纬度）、高斯平面直角坐标系、独立坐标系。',
      formula:null, keywords:['大地水准面','高程','坐标系'], examWeight:4 },

    // 模块2 水准测量
    { id:'CL-003', chapter:'模块2 水准测量', title:'水准测量原理', difficulty:2,
      content:'水准测量利用水平视线测定两点间高差。h_AB = a - b（后视-前视）。H_B = H_A + h_AB。前后视距相等可消减i角误差。',
      formula:'h_AB = a - b, H_B = H_A + h_AB', keywords:['水准测量','高差','后视','前视'], examWeight:5 },
    { id:'CL-004', chapter:'模块2 水准测量', title:'水准仪的使用与检校', difficulty:2,
      content:'操作步骤：粗平（圆水准器）→瞄准→精平（符合水准管）→读数。i角误差：水准管轴与视准轴在竖直面内投影不平行。前后视距相等可消除i角误差影响。',
      formula:null, keywords:['粗平','精平','i角误差'], examWeight:4 },
    { id:'CL-005', chapter:'模块2 水准测量', title:'水准路线与内业计算', difficulty:3,
      content:'水准路线形式：闭合水准路线、附合水准路线、支水准路线。高差闭合差f_h=∑h_测-∑h_理。闭合水准：f_h=∑h_测。闭合差允许值f_h容=±12√n mm（等外）或±40√L mm。改正数按测站数（或距离）分配。',
      formula:'f_h=∑h_测, v_i=-f_h/∑n×n_i', keywords:['闭合差','改正数','水准路线'], examWeight:5 },

    // 模块3 角度测量
    { id:'CL-006', chapter:'模块3 角度测量', title:'水平角与竖直角', difficulty:2,
      content:'水平角：地面上两直线在水平面上投影的夹角（0°~360°）。竖直角：视线与水平线的夹角（-90°~+90°）。DJ6经纬仪：一测回方向观测中误差不超过±6″。',
      formula:null, keywords:['水平角','竖直角','DJ6'], examWeight:4 },
    { id:'CL-007', chapter:'模块3 角度测量', title:'测回法观测水平角', difficulty:3,
      content:'盘左（上半测回）：瞄左目标A读数a₁→顺时针瞄右目标B读数b₁→β_左=b₁-a₁。盘右（下半测回）：瞄B读数b₂→顺时针瞄A读数a₂→β_右=b₂-a₂。|β_左-β_右|≤40″→取平均β=(β_左+β_右)/2。',
      formula:'β=(β_左+β_右)/2', keywords:['测回法','盘左','盘右'], examWeight:5 },
    { id:'CL-008', chapter:'模块3 角度测量', title:'竖盘指标差', difficulty:3,
      content:'竖盘指标差x=(L+R-360°)/2。盘左盘右观测取平均可以消除指标差的影响。竖直角计算（顺时针注记）：α_左=90°-L, α_右=R-270°。',
      formula:'x=(L+R-360°)/2', keywords:['指标差','盘左','盘右'], examWeight:4 },

    // 模块4 距离测量
    { id:'CL-009', chapter:'模块4 距离测量', title:'钢尺量距与视距测量', difficulty:2,
      content:'钢尺量距精密方法需加三项改正：尺长改正Δl_d、温度改正Δl_t、倾斜改正Δl_h。视距测量原理：D=k·l+c（k=100为乘常数）。',
      formula:'D=kl+c, D实际=l+Δl_d+Δl_t+Δl_h', keywords:['尺长改正','温度改正','视距'], examWeight:4 },

    // 模块5 测量误差
    { id:'CL-010', chapter:'模块5 测量误差', title:'系统误差与偶然误差', difficulty:2,
      content:'系统误差：符号和大小有规律（累积性），如尺长误差→加改正。偶然误差：符号和大小无规律，有界性、单峰性、对称性、抵偿性。系统误差可通过公式改正或对称观测消除；偶然误差只能增加观测次数来减小。',
      formula:null, keywords:['系统误差','偶然误差','特性'], examWeight:5 },
    { id:'CL-011', chapter:'模块5 测量误差', title:'中误差与误差传播定律', difficulty:3,
      content:'中误差m=±√([vv]/(n-1))（白塞尔公式）。误差传播定律：倍数函数m_Z=k·m_x；和差函数m_Z=±√(m₁²+m₂²)；线性函数m_Z=±√(k₁²m₁²+k₂²m₂²)；一般函数m_Z=±√((∂F/∂x₁)²m₁²+(∂F/∂x₂)²m₂²)。',
      formula:'m_Z=±√(m₁²+m₂²) (和差), m=±√([vv]/(n-1))', keywords:['中误差','误差传播定律','白塞尔公式'], examWeight:5 },

    // 模块6 控制测量
    { id:'CL-012', chapter:'模块6 控制测量', title:'导线测量外业', difficulty:3,
      content:'导线外业：踏勘选点→角度观测（左角）→边长测量→定向测量（连接角）。导线形式：闭合导线、附合导线、支导线。坐标方位角范围0°~360°。',
      formula:null, keywords:['导线','选点','角度观测','定向'], examWeight:4 },
    { id:'CL-013', chapter:'模块6 控制测量', title:'导线内业计算', difficulty:4,
      content:'角度闭合差分配：f_β平均分配到各角。坐标增量：Δx=D·cosα, Δy=D·sinα。坐标增量闭合差：f_x按边长成正比分配（符号相反）。导线全长相对闭合差K=f_D/∑D。',
      formula:'Δx=Dcosα, Δy=Dsinα, K=f_D/∑D', keywords:['坐标增量','闭合差','方位角'], examWeight:5 },

    // 模块7 地形图
    { id:'CL-014', chapter:'模块7 地形图', title:'地形图比例尺与符号', difficulty:2,
      content:'比例尺精度：图上0.1mm对应的实地距离。1:500比例尺精度=0.05m。地形图符号：比例符号、非比例符号、半比例符号、注记符号。',
      formula:null, keywords:['比例尺','精度','符号'], examWeight:3 },
    { id:'CL-015', chapter:'模块7 地形图', title:'等高线及其特性', difficulty:3,
      content:'等高线特性：①同一等高线上各点高程相等；②等高线是闭合曲线；③一般不相交不重合；④与山脊线、山谷线正交；⑤等高线越密坡度越陡。山脊线：等高线凸向低处。山谷线：等高线凸向高处。',
      formula:null, keywords:['等高线','特性','山脊','山谷'], examWeight:4 },

    // 模块8 GNSS
    { id:'CL-016', chapter:'模块8 GNSS测量', title:'GNSS定位原理', difficulty:3,
      content:'GPS定位原理：空间后方距离交会。至少需4颗卫星（3颗定位+1颗解钟差）。RTK：基准站接收卫星信号→发送差分改正数→流动站实时解算厘米级坐标。优势：无需通视、效率高、单点独立测量。',
      formula:null, keywords:['GPS','RTK','差分','卫星'], examWeight:4 },

    // 模块9 施工测量
    { id:'CL-017', chapter:'模块9 施工测量', title:'测设的基本工作', difficulty:3,
      content:'测设是测量的逆过程（图上→实地）。水平角测设：正倒镜分中法。水平距离测设：从起点沿指定方向量出设计距离（需加改正）。高程测设：水准仪法。极坐标法测设：需角度+距离两个要素。',
      formula:null, keywords:['测设','正倒镜分中法','极坐标法'], examWeight:5 },
    { id:'CL-018', chapter:'模块9 施工测量', title:'土方量计算与变形监测', difficulty:3,
      content:'方格网法计算土方量：绘制方格网→内插角点高程→计算设计高程H₀→计算填挖高度h=H设-H地→确定零线→分格计算填挖方量→汇总。变形监测：基准点≥3个设在稳定区。预警：沉降速率>2~3mm/d。',
      formula:'H₀=(∑H角+2∑H边+4∑H中)/(4n), V=(A/4)(h₁+h₂+h₃+h₄)', keywords:['方格网法','土方量','变形监测'], examWeight:4 }
  ],

  // ==================== 题库 ====================
  quizzes: {
    foundation: [
      { id:'F01', type:'fill', chapter:'模块2', difficulty:2,
        q:'测回法观测水平角时，盘左观测得上半测回角值β_左，盘右观测得β_右。若|β_左-β_右|≤40″（DJ6级），取平均值为______。',
        ans:'(β_左+β_右)/2', explain:'盘左盘右取平均可消除视准轴误差和横轴误差。' },
      { id:'F02', type:'fill', chapter:'模块3', difficulty:3,
        q:'经纬仪竖盘指标差x的计算公式为x=______。盘左盘右观测取平均可以______指标差的影响。',
        ans:'(L+R-360°)/2; 消除', explain:'指标差x=(L+R-360°)/2，盘左盘右取平均可消除x。' },
      { id:'F03', type:'fill', chapter:'模块5', difficulty:3,
        q:'误差传播定律中，对于和差函数Z=x₁±x₂，其中误差关系为m_Z=______。',
        ans:'±√(m₁²+m₂²)', explain:'无论加减，中误差传播公式相同：m_Z=±√(m₁²+m₂²)。' },
      { id:'F04', type:'fill', chapter:'模块5', difficulty:3,
        q:'对某量进行n次等精度观测，观测值的中误差（单位权中误差）m=______。',
        ans:'±√([vv]/(n-1))', explain:'白塞尔公式，v为最或是值改正数，n-1为自由度。' },
      { id:'F05', type:'fill', chapter:'模块2', difficulty:2,
        q:'水准测量中高差h_AB的计算公式为h_AB=______。',
        ans:'a-b（后视读数-前视读数）', explain:'h_AB=a-b。若a>b则B点高于A点（h_AB为正）。' }
    ],

    specialized: [
      { id:'S01', type:'choice', chapter:'模块3', difficulty:1,
        q:'DJ6光学经纬仪中，"6"表示该仪器一测回方向观测中误差不超过（ ）',
        opts:['±0.6″','±6″','±60″','±600″'], ans:1 },
      { id:'S02', type:'choice', chapter:'模块3', difficulty:3,
        q:'竖直角观测中，盘左读数L=78°30′24″，盘右读数R=281°29′48″，竖盘为顺时针注记，则竖直角α为（ ）',
        opts:['+11°29′36″','+11°29′42″','-11°29′36″','-11°29′42″'], ans:1,
        explain:'α_左=90°-L=11°29′36″, α_右=R-270°=11°29′48″, α=(α_左+α_右)/2=11°29′42″。' },
      { id:'S03', type:'choice', chapter:'模块5', difficulty:2,
        q:'偶然误差的四个特性不包括（ ）',
        opts:['有界性','单峰性','对称性','累积性'], ans:3,
        explain:'累积性是系统误差的特征。偶然误差四大特性：有界性、单峰性、对称性、抵偿性。' },
      { id:'S04', type:'choice', chapter:'模块5', difficulty:3,
        q:'一矩形场地长a=50m，宽b=30m，丈量中误差均为±0.02m，则面积中误差m_S为（ ）',
        opts:['±1.0m²','±1.17m²','±0.04m²','±0.06m²'], ans:1,
        explain:'S=a×b, m_S=√(b²m_a²+a²m_b²)=√(30²×0.02²+50²×0.02²)=√(0.36+1.00)=±1.17m²。' },
      { id:'S05', type:'choice', chapter:'模块6', difficulty:2,
        q:'导线全长相对闭合差K的表达式为（ ）',
        opts:['f_D/∑D','∑D/f_D','f_D×∑D','f_D-∑D'], ans:0 },
      { id:'S06', type:'choice', chapter:'模块7', difficulty:2,
        q:'等高线的特性不包括（ ）',
        opts:['同一条等高线上各点高程相等','等高线是闭合曲线','等高线可以相交','等高线越密表示坡度越陡'], ans:2,
        explain:'等高线一般不相交、不重合（悬崖峭壁除外，用特殊符号表示）。' }
    ],

    advanced: [
      { id:'A01', type:'calc', chapter:'模块5', difficulty:3, stage:3,
        q:'用DJ6经纬仪观测某水平角4个测回，各测回角值为：β₁=85°42′15″，β₂=85°42′21″，β₃=85°42′18″，β₄=85°42′24″。求：(1)最或是值；(2)观测值中误差；(3)最或是值中误差。',
        ans:'最或是值=85°42′19.5″, m=±3.87″, M=±1.94″',
        explain:'v₁=-4.5″,v₂=+1.5″,v₃=-1.5″,v₄=+4.5″。[vv]=45。m=±√(45/3)=±3.87″。M=m/√4=±1.94″。' },
      { id:'A02', type:'calc', chapter:'模块5', difficulty:3, stage:3,
        q:'在1:500地形图上量得矩形地块图长a\'=80.0mm，图宽b\'=60.2mm，量测中误差均为±0.2mm。求实际面积及其中误差。',
        ans:'S=1204.00m², m_S=±5.01m²',
        explain:'实际a=40.00m, b=30.10m, S=1204.00m²。m_a=m_b=0.2×500=100mm=0.10m。m_S=√(b²m_a²+a²m_b²)=±5.01m²。' }
    ],

    mock1: [
      { id:'M01', type:'choice', chapter:'综合', difficulty:1,
        q:'测量工作的基本原则是（ ）',
        opts:['先碎部后控制','先控制后碎部、先整体后局部','边控制边碎部','随意安排'], ans:1 },
      { id:'M02', type:'choice', chapter:'综合', difficulty:2,
        q:'下列哪项不属于偶然误差的特性（ ）',
        opts:['有界性','单峰性','累积性','对称性'], ans:2 },
      { id:'M03', type:'fill', chapter:'综合', difficulty:2,
        q:'水准测量中前后视距应尽量相等，主要目的是消减______误差。',
        ans:'i角', explain:'前后视距相等→i角对前后视读数的影响相同→在高差计算中抵消。' },
      { id:'M04', type:'calc', chapter:'综合', difficulty:3,
        q:'闭合水准路线共4段：h₁=+2.315m(4站)，h₂=-1.208m(6站)，h₃=+0.842m(3站)，h₄=-1.972m(5站)，H_A=100.000m。求：(1)f_h；(2)改正后各段高差；(3)各点高程。',
        ans:'f_h=-23mm, f_h容=±51mm(合格), H₁=102.320, H₂=101.120, H₃=101.966, H₄=100.000✓',
        explain:'∑h=-0.023m=-23mm。v_i=-f_h/∑n×n_i=+1.278n_i。改正后h₁=2.320, h₂=-1.200, h₃=0.846, h₄=-1.966。' }
    ],

    mock2: [
      { id:'X01', type:'choice', chapter:'综合', difficulty:2,
        q:'GPS定位至少需要同时观测几颗卫星才能确定地面点三维坐标（ ）',
        opts:['2颗','3颗','4颗','5颗'], ans:2,
        explain:'需要4颗卫星：3颗用于空间后方距离交会确定三维坐标，1颗用于解算接收机钟差。' },
      { id:'X02', type:'choice', chapter:'综合', difficulty:3,
        q:'施工测量中测设与测量的关系是（ ）',
        opts:['完全相同','测设是测量的逆过程（图上→实地）','测量是测设的逆过程','没有关系'], ans:1 },
      { id:'X03', type:'fill', chapter:'综合', difficulty:2,
        q:'三北方向是指______、______和坐标北。',
        ans:'真北; 磁北', explain:'三北方向：真北（地理北）、磁北（地磁北极）、坐标北（高斯投影带中央子午线）。' },
      { id:'X04', type:'calc', chapter:'综合', difficulty:3,
        q:'在1:1000地形图上量得地块四点坐标（单位mm）：A(50,40), B(110,40), C(110,95), D(50,95)，量测中误差±0.2mm。求实际面积及中误差。',
        ans:'S=3300.00m², m_S=±16.28m², 相对中误差=1/203',
        explain:'图长=60mm→实长=60m, 图宽=55mm→实宽=55m, S=3300m²。m=0.2×1000=0.20m。m_S=√(55²×0.2²+60²×0.2²)=±16.28m²。' }
    ]
  },

  stageMap: {
    1: {
      name: '基础学习',
      icon: '📐',
      color: 'stage-1',
      desc: '测量学概论 → 水准测量原理 → 角度测量入门',
      chapters: ['模块1 绪论','模块2 水准测量','模块3 角度测量'],
      kpIds: ['CL-001','CL-002','CL-003','CL-004','CL-006','CL-007','CL-008']
    },
    2: {
      name: '专项攻坚',
      icon: '🎯',
      color: 'stage-2',
      desc: '距离测量 → 测量误差 → 控制测量',
      chapters: ['模块4 距离测量','模块5 测量误差','模块6 控制测量'],
      kpIds: ['CL-009','CL-010','CL-011','CL-012','CL-013']
    },
    3: {
      name: '核心进阶',
      icon: '⚡',
      color: 'stage-3',
      desc: '地形图应用 → GNSS测量 → 施工测量',
      chapters: ['模块7 地形图','模块8 GNSS测量','模块9 施工测量'],
      kpIds: ['CL-014','CL-015','CL-016','CL-017','CL-018']
    },
    4: {
      name: '综合实战',
      icon: '🏆',
      color: 'stage-4',
      desc: '全真模拟卷训练 → 查漏补缺 → 错题回顾',
      chapters: ['全部模块'],
      kpIds: [],
      mockId: 'mock1'
    },
    5: {
      name: '冲刺模考',
      icon: '🚀',
      color: 'stage-5',
      desc: '限时模考 → 压轴题突破 → 考前冲刺',
      chapters: ['全部模块'],
      kpIds: [],
      mockId: 'mock2'
    }
  }
};

window.SurveyingData = SurveyingData;
