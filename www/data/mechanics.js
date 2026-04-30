/**
 * 工程力学 - 全部知识点与题库数据
 * 安徽农业大学专升本考试大纲（第1-15章，不含第11、14章）
 */
const MechanicsData = {

  // ==================== 知识点库 ====================
  knowledgePoints: [
    // 第1章 静力学基础
    { id:'GC-001', chapter:'第1章 静力学基础', title:'力与刚体的基本概念', difficulty:1,
      content:'力是物体间的相互机械作用，三要素：大小、方向、作用点。刚体是在力作用下不变形的物体（理想化模型）。',
      formula:null, keywords:['力','刚体','三要素'], examWeight:3 },
    { id:'GC-002', chapter:'第1章 静力学基础', title:'静力学基本公理', difficulty:1,
      content:'二力平衡公理：等值、反向、共线。加减平衡力系公理。平行四边形法则：合力为邻边的对角线。作用与反作用公理。',
      formula:null, keywords:['公理','平衡','平行四边形法则'], examWeight:3 },
    { id:'GC-003', chapter:'第1章 静力学基础', title:'约束与约束力', difficulty:2,
      content:'柔索约束：拉力，沿柔索方向。光滑接触面约束：法向压力。固定铰支座：F_Ax, F_Ay 两个正交分力。活动铰支座：一个垂直于支承面的力。固定端：三个约束力（F_Ax, F_Ay, M_A）。',
      formula:null, keywords:['约束','铰支座','固定端','受力分析'], examWeight:4 },
    { id:'GC-004', chapter:'第1章 静力学基础', title:'受力分析与受力图', difficulty:2,
      content:'步骤：1.明确研究对象，取分离体；2.画主动力；3.画约束力（根据约束类型确定方向和数量）；4.标注力符号。注意：二力杆两端受力沿杆轴线方向。',
      formula:null, keywords:['受力图','分离体','二力杆'], examWeight:5 },

    // 第2章 平面汇交力系
    { id:'GC-005', chapter:'第2章 平面汇交力系', title:'平面汇交力系的合成与平衡', difficulty:2,
      content:'几何法：力多边形法则，合力为力多边形的封闭边。平衡条件：力多边形自行闭合。解析法：合力投影定理。平衡方程：∑F_x=0, ∑F_y=0。',
      formula:'∑F_x=0, ∑F_y=0', keywords:['汇交力系','力多边形','平衡方程'], examWeight:4 },

    // 第3章 平面任意力系
    { id:'GC-006', chapter:'第3章 平面任意力系', title:'力对点的矩与合力矩定理', difficulty:2,
      content:'力矩 M_O(F) = ±F·d（逆正顺负）。合力矩定理：合力对任一点的矩 = 各分力对同一点矩的代数和。力偶：等值、反向、不共线的两个力，力偶矩 M = ±F·d。',
      formula:'M_O(F) = ±F·d', keywords:['力矩','力偶','合力矩定理'], examWeight:4 },
    { id:'GC-007', chapter:'第3章 平面任意力系', title:'平面任意力系的简化与平衡', difficulty:3,
      content:'向一点简化得主矢 R\' 和主矩 M_O。四种结果：①R\'=0,M_O=0 平衡；②R\'=0,M_O≠0 力偶；③R\'≠0,M_O=0 合力过简化中心；④R\'≠0,M_O≠0 可进一步简化为合力。平衡方程一矩式：∑F_x=0, ∑F_y=0, ∑M_A=0。',
      formula:'∑F_x=0, ∑F_y=0, ∑M_A=0', keywords:['主矢','主矩','平衡方程','三种形式'], examWeight:5 },

    // 第4章 空间力系（略讲）
    { id:'GC-008', chapter:'第4章 空间力系', title:'空间力系的平衡方程', difficulty:3,
      content:'空间任意力系的6个独立平衡方程：∑F_x=0, ∑F_y=0, ∑F_z=0, ∑M_x=0, ∑M_y=0, ∑M_z=0。专升本以了解为主。',
      formula:'6个空间平衡方程', keywords:['空间力系','平衡方程'], examWeight:1 },

    // 第5章 材料力学基础
    { id:'GC-009', chapter:'第5章 材料力学基础', title:'材料力学基本假设与内力', difficulty:1,
      content:'三个基本假设：连续性假设、均匀性假设、各向同性假设。内力：物体内部各部分之间的相互作用力。截面法三步：截开→替代→平衡。',
      formula:null, keywords:['连续性','均匀性','各向同性','截面法'], examWeight:3 },
    { id:'GC-010', chapter:'第5章 材料力学基础', title:'应力与应变的概念', difficulty:2,
      content:'正应力 σ = F_N/A（单位：Pa）。切应力 τ = F_s/A。线应变 ε = Δl/l。胡克定律：σ = E·ε（E为弹性模量）。泊松比 μ = -ε\'/ε。',
      formula:'σ=Eε, σ=F_N/A, ε=Δl/l', keywords:['应力','应变','胡克定律','弹性模量'], examWeight:4 },

    // 第6章 轴向拉伸与压缩
    { id:'GC-011', chapter:'第6章 轴向拉伸与压缩', title:'轴力与轴力图', difficulty:2,
      content:'轴力 F_N：沿杆轴线方向的内力，拉力为正（+），压力为负（-）。轴力图：表示轴力沿杆长变化规律的图形，用截面法分段计算。',
      formula:null, keywords:['轴力','轴力图','拉为正'], examWeight:4 },
    { id:'GC-012', chapter:'第6章 轴向拉伸与压缩', title:'拉压杆的强度计算', difficulty:3,
      content:'强度条件：σ_max = F_N/A ≤ [σ]（许用应力）。三类问题：①校核强度；②设计截面 A ≥ F_N/[σ]；③确定许用荷载 F_N ≤ A[σ]。',
      formula:'σ_max = F_N/A ≤ [σ]', keywords:['强度条件','许用应力','截面设计'], examWeight:5 },
    { id:'GC-013', chapter:'第6章 轴向拉伸与压缩', title:'拉压杆的变形计算', difficulty:3,
      content:'胡克定律：Δl = F_N·l/(E·A)。斜截面应力：σ_α = σ·cos²α，τ_α = (σ/2)·sin2α。α=45°时切应力最大（τ_max = σ/2）。',
      formula:'Δl = F_N·l/(EA), τ_max = σ/2 (α=45°)', keywords:['变形','胡克定律','斜截面应力'], examWeight:5 },

    // 第7章 扭转
    { id:'GC-014', chapter:'第7章 扭转', title:'圆轴扭转的切应力', difficulty:3,
      content:'扭转切应力 τ = T·ρ/I_p（T为扭矩，ρ为到圆心的距离）。最大切应力 τ_max = T/W_t（W_t为抗扭截面系数）。实心圆：W_t = πd³/16，I_p = πd⁴/32。空心圆：W_t = (πD³/16)(1-α⁴)，α=d/D。',
      formula:'τ_max = T/W_t, W_t=πd³/16 (实心)', keywords:['扭转','切应力','抗扭截面系数'], examWeight:5 },
    { id:'GC-015', chapter:'第7章 扭转', title:'圆轴扭转的强度与刚度', difficulty:3,
      content:'强度条件：τ_max = T/W_t ≤ [τ]。刚度条件：θ_max = T/(G·I_p)·(180/π) ≤ [θ]（°/m）。工程中常采用空心轴：材料分布在距圆心较远处，比刚度更高。',
      formula:'τ_max ≤ [τ], θ_max ≤ [θ]', keywords:['强度条件','刚度条件','空心轴'], examWeight:5 },

    // 第8章 弯曲内力
    { id:'GC-016', chapter:'第8章 弯曲内力', title:'剪力与弯矩', difficulty:3,
      content:'剪力 F_S：截面一侧所有外力在截面方向投影的代数和。弯矩 M：截面一侧所有外力对截面形心力矩的代数和。符号规定：使梁段顺时针转动（左上右下）的剪力为正；使梁段向下凸（上压下拉）的弯矩为正。',
      formula:null, keywords:['剪力','弯矩','符号规定'], examWeight:4 },
    { id:'GC-017', chapter:'第8章 弯曲内力', title:'剪力方程与弯矩方程', difficulty:3,
      content:'F_S = F_S(x)：剪力沿梁长的分布函数。M = M(x)：弯矩沿梁长的分布函数。利用微分关系 dF_S/dx = -q, dM/dx = F_S 可快速画剪力图和弯矩图。',
      formula:'dF_S/dx = -q, dM/dx = F_S', keywords:['剪力方程','弯矩方程','微分关系'], examWeight:5 },

    // 第9章 弯曲应力
    { id:'GC-018', chapter:'第9章 弯曲应力', title:'纯弯曲正应力', difficulty:3,
      content:'纯弯曲正应力公式：σ = M·y/I_z（y为到中性轴的距离）。最大正应力 σ_max = M/W_z。矩形截面：I_z = bh³/12，W_z = bh²/6。圆形截面：I_z = πd⁴/64，W_z = πd³/32。',
      formula:'σ = My/I_z, σ_max = M/W_z', keywords:['纯弯曲','正应力','惯性矩','抗弯截面系数'], examWeight:5 },
    { id:'GC-019', chapter:'第9章 弯曲应力', title:'弯曲正应力强度条件', difficulty:3,
      content:'强度条件：σ_max = M_max/W_z ≤ [σ]。注意：对于铸铁等脆性材料，需分别校核拉应力和压应力。',
      formula:'σ_max = M_max/W_z ≤ [σ]', keywords:['强度条件','许用应力'], examWeight:5 },

    // 第10章 弯曲变形
    { id:'GC-020', chapter:'第10章 弯曲变形', title:'挠曲线与叠加法', difficulty:3,
      content:'挠度 v：截面形心在垂直于轴线方向的线位移。转角 θ：截面绕中性轴转动的角度。叠加法求弯曲变形的条件：小变形（变形不影响荷载作用位置）+ 线弹性（满足胡克定律）。',
      formula:null, keywords:['挠度','转角','叠加法','小变形','线弹性'], examWeight:4 },

    // 第12章 组合变形
    { id:'GC-021', chapter:'第12章 组合变形', title:'拉（压）弯组合变形', difficulty:3,
      content:'危险点应力：σ = F_N/A ± M/W_z。偏心受压截面核心：压力作用点在截面核心内时，截面上只有压应力（不出现拉应力）。矩形截面核心为菱形。',
      formula:'σ = F_N/A ± M/W_z', keywords:['组合变形','偏心受压','截面核心'], examWeight:5 },
    { id:'GC-022', chapter:'第12章 组合变形', title:'弯扭组合变形', difficulty:4,
      content:'弯曲+扭转同时作用时，按第三强度理论（最大切应力理论）：σ_r3 = √(σ²+4τ²) ≤ [σ]。按第四强度理论（畸变能理论）：σ_r4 = √(σ²+3τ²) ≤ [σ]。',
      formula:'σ_r3 = √(σ²+4τ²), σ_r4 = √(σ²+3τ²)', keywords:['弯扭组合','强度理论','第三强度理论','第四强度理论'], examWeight:4 },

    // 第13章 压杆稳定
    { id:'GC-023', chapter:'第13章 压杆稳定', title:'压杆稳定的概念与欧拉公式', difficulty:3,
      content:'压杆失稳：当轴向压力达到临界值时，杆件突然发生弯曲。欧拉公式（大柔度杆）：F_cr = π²EI/(μl)²。长度系数 μ：两端铰支 μ=1.0，一端固定一端自由 μ=2.0，两端固定 μ=0.5，一端固定一端铰支 μ=0.7。',
      formula:'F_cr = π²EI/(μl)²', keywords:['失稳','临界力','欧拉公式','长度系数'], examWeight:5 },
    { id:'GC-024', chapter:'第13章 压杆稳定', title:'临界应力总图与压杆分类', difficulty:4,
      content:'柔度 λ = μl/i（i=√(I/A)为惯性半径）。λ_p = π√(E/σ_p)：大柔度分界点。λ_s = (a-σ_s)/b：中小柔度分界点。大柔度（λ≥λ_p）：欧拉公式，弹性失稳。中柔度（λ_s≤λ<λ_p）：直线公式 σ_cr=a-bλ，弹塑性失稳。小柔度（λ<λ_s）：σ_cr=σ_s，强度破坏。稳定计算：[F]=F_cr/n_st。',
      formula:'λ=μl/i, σ_cr=a-bλ (中柔度)', keywords:['柔度','临界应力总图','大柔度','中柔度','小柔度'], examWeight:5 },

    // 第15章 截面的几何性质
    { id:'GC-025', chapter:'第15章 截面几何性质', title:'静矩与形心', difficulty:2,
      content:'静矩（面积矩）S_z = ∫_A y·dA = A·y_c。形心坐标 y_c = S_z/A。组合截面静矩 = 各组成部分静矩的代数和。',
      formula:'S_z = A·y_c', keywords:['静矩','形心','面积矩'], examWeight:3 },
    { id:'GC-026', chapter:'第15章 截面几何性质', title:'惯性矩与平行移轴公式', difficulty:3,
      content:'惯性矩 I_z = ∫_A y²·dA。惯性积 I_yz = ∫_A yz·dA。平行移轴公式：I_z = I_zc + a²A（I_zc为过形心轴的惯性矩，a为轴间距）。',
      formula:'I_z = I_zc + a²A', keywords:['惯性矩','惯性积','平行移轴公式'], examWeight:4 }
  ],

  // ==================== 题库 ====================
  // 按阶段组织：1-基础学习 2-专项攻坚 3-核心进阶 4-综合实战 5-冲刺模考
  quizzes: {
    // 阶段1：基础学习 - 填空题与基础概念
    foundation: [
      // 静力学基础
      { id:'F01', type:'fill', chapter:'第1章', difficulty:1,
        q:'平面汇交力系平衡的几何条件是______闭合。',
        ans:'力多边形', explain:'力多边形法则：平面汇交力系平衡的充要条件是力多边形自行闭合。' },
      { id:'F02', type:'fill', chapter:'第1章', difficulty:1,
        q:'材料力学的基本假设包括：连续性假设、______假设和各向同性假设。',
        ans:'均匀性', explain:'三个基本假设：连续性、均匀性、各向同性。' },
      { id:'F03', type:'fill', chapter:'第2章', difficulty:2,
        q:'AB杆为二力杆，其受力沿______方向。',
        ans:'AB连线', explain:'二力杆两端受力沿杆轴线方向（两端铰接点的连线）。' },
      // 拉压
      { id:'F04', type:'fill', chapter:'第6章', difficulty:2,
        q:'拉压杆斜截面上的应力中，当截面与横截面夹角α=45°时，______应力取得最大值。',
        ans:'切', explain:'τ_α=(σ/2)·sin2α，α=45°时sin2α=1取最大，τ_max=σ/2。' },
      // 扭转
      { id:'F05', type:'fill', chapter:'第7章', difficulty:3,
        q:'空心圆轴外径D，内径d，其抗扭截面系数W_t=______。',
        ans:'(πD³/16)(1-α⁴), α=d/D', explain:'W_t=πD³(1-α⁴)/16。空心轴同重量下抗扭能力更强。' },
      // 弯曲
      { id:'F06', type:'fill', chapter:'第9章', difficulty:2,
        q:'圆形截面（直径d）对中性轴的惯性矩I_z=______。',
        ans:'πd⁴/64', explain:'圆形截面惯性矩I_z=πd⁴/64，抗弯截面系数W_z=πd³/32。' },
      { id:'F07', type:'fill', chapter:'第8章', difficulty:2,
        q:'简支梁受均布荷载q，跨度l，梁端剪力F_SA=______，跨中弯矩M_C=______。',
        ans:'ql/2; ql²/8', svg:'beamSimpleUniform',
        explain:'简支梁均布荷载：支座反力R_A=R_B=ql/2，跨中弯矩M_max=ql²/8。' },
      // 压杆
      { id:'F08', type:'fill', chapter:'第13章', difficulty:2,
        q:'压杆的柔度λ的计算公式为λ=______，其中i为惯性半径。',
        ans:'μl/i', explain:'柔度λ=μl/i，综合反映了杆长、约束和截面形状对压杆稳定性的影响。' },
      { id:'F09', type:'fill', chapter:'第13章', difficulty:2,
        q:'欧拉公式F_cr=π²EI/(μl)²适用于______柔度杆。当中柔度时应采用______公式。',
        ans:'大; 直线经验', explain:'大柔度→欧拉双曲线；中柔度→直线公式σ_cr=a-bλ；小柔度→σ_cr=σ_s。' },
      { id:'F10', type:'fill', chapter:'第12章', difficulty:2,
        q:'迭加法求弯曲变形的前提条件是______和______。',
        ans:'小变形; 线弹性', explain:'小变形确保变形不影响荷载作用位置，线弹性确保应力-应变满足胡克定律。' }
    ],

    // 阶段2：专项攻坚 - 选择题
    specialized: [
      { id:'S01', type:'choice', chapter:'第1章', difficulty:1,
        q:'一力F沿互相垂直的x、y轴分解，两分力的大小（ ）',
        opts:['一定相等','与力F与坐标轴的夹角有关','都小于F','与F无关'], ans:1 },
      { id:'S02', type:'choice', chapter:'第1章', difficulty:3,
        q:'图示三铰拱，A、B为固定铰支座，C为中间铰。这是（ ）',
        opts:['静定结构','一次超静定结构','二次超静定结构','几何可变体系'], ans:0, svg:'threeHingedArch',
        explain:'3个未知力+1个铰C约束条件-3个平衡方程=3个独立方程=3个未知数，为静定结构。' },
      { id:'S03', type:'choice', chapter:'第5章', difficulty:1,
        q:'低碳钢拉伸应力-应变曲线中，屈服阶段出现的现象是（ ）',
        opts:['应力急剧增加','应变急剧增加而应力基本不变','材料断裂','应变基本不变'], ans:1,
        explain:'屈服阶段：应力基本不变但应变急剧增加，材料暂时失去抵抗变形的能力。' },
      { id:'S04', type:'choice', chapter:'第6章', difficulty:2,
        q:'阶梯杆AB段面积A₁，BC段面积A₂，受轴向力P。若A₁>A₂，则最大正应力发生在（ ）',
        opts:['AB段','BC段','两段相同','不能确定'], ans:1,
        explain:'轴力N相同，σ=F_N/A。A₂更小，故σ更大。' },
      { id:'S05', type:'choice', chapter:'第9章', difficulty:1,
        q:'下列哪些量不属于截面几何性质（ ）',
        opts:['静矩（面积矩）','惯性矩','弹性模量','惯性积'], ans:2,
        explain:'弹性模量E是材料常数（MPa），不属于截面几何性质。' },
      { id:'S06', type:'choice', chapter:'第9章', difficulty:2,
        q:'梁弯曲时，正应力在横截面上的分布与（ ）成正比',
        opts:['到截面边缘的距离','到中性轴的距离','到截面形心的距离','截面宽度的平方'], ans:1,
        explain:'σ=My/I_z，正应力与到中性轴的距离y成正比。' },
      { id:'S07', type:'choice', chapter:'第7章', difficulty:2,
        q:'圆轴受扭时，轴表面一点的应力状态为（ ）',
        opts:['单向应力状态','纯剪切应力状态','二向应力状态','三向应力状态'], ans:1,
        explain:'圆轴扭转时表面点只有切应力，无正应力，为纯剪切应力状态。' },
      { id:'S08', type:'choice', chapter:'第13章', difficulty:3,
        q:'两个压杆材料和截面相同，长度也相同，仅约束不同。杆A两端铰支(μ=1.0)，杆B两端固定(μ=0.5)。其临界力之比F_cr,A:F_cr,B为（ ）',
        opts:['1:1','1:2','1:4','4:1'], ans:2, svg:'bucklingCompare',
        explain:'F_cr∝1/μ²，(1/1²):(1/0.5²)=1:4。' },
      { id:'S09', type:'choice', chapter:'第12章', difficulty:2,
        q:'矩形截面核心的形状是（ ）',
        opts:['矩形','圆形','菱形','椭圆形'], ans:2, svg:'eccentricCompression',
        explain:'矩形截面核心为菱形（对角线分别为b/3和h/3）。' },
      { id:'S10', type:'choice', chapter:'第7章', difficulty:2,
        q:'在相同条件下，空心圆轴的抗扭能力比实心圆轴（同重量）更（ ）',
        opts:['差','好','完全相同','取决于长度'], ans:1,
        explain:'材料分布在距圆心较远处→I_p和W_t更大→比刚度更高。' }
    ],

    // 阶段3：核心进阶 - 计算题
    advanced: [
      { id:'A01', type:'calc', chapter:'第3章', difficulty:3, stage:3,
        q:'简支梁AB跨度l=6m，距A端2m处受集中力P=40kN，距B端1m处受力偶M=30kN·m（逆时针）。求支座反力R_A和R_B。',
        ans:'R_A=31.67kN(↑), R_B=8.33kN(↑)', svg:'beamSimplePoint',
        explain:'∑M_A=0: R_B×6-40×2+30=0 → R_B=8.33kN。∑F_y=0: R_A+R_B-40=0 → R_A=31.67kN。' },
      { id:'A02', type:'calc', chapter:'第9章', difficulty:3, stage:3,
        q:'简支梁l=8m，全跨均布荷载q=15kN/m，工字钢截面I=2.37×10⁸mm⁴，h=500mm，E=200GPa，[σ]=160MPa。(1)校核正应力强度；(2)求跨中最大挠度。',
        ans:'σ_max=126.6MPa<[σ]=160MPa✓; v_max=16.9mm', svg:'beamSimpleUniform',
        explain:'M_max=ql²/8=120kN·m。σ_max=My/I=120×10⁶×250/(2.37×10⁸)=126.6MPa。<160MPa✓。v_max=5ql⁴/(384EI)=16.9mm≈l/473。' },
      { id:'A03', type:'calc', chapter:'第7章', difficulty:3, stage:3,
        q:'实心圆轴传递P=150kW，n=300r/min，[τ]=80MPa，G=80GPa，[θ]=0.3°/m。(1)按强度确定直径d₁；(2)按刚度确定直径d₂；(3)确定最终直径。',
        ans:'d₁=67.3mm, d₂=79.1mm, 取d=80mm',
        explain:'T=9549×P/n=4775N·m。d₁≥∛(16T/(π[τ]))=67.3mm。d₂≥∜(32T×180/(Gπ²[θ]))=79.1mm。取d=80mm。' },
      { id:'A04', type:'calc', chapter:'第13章', difficulty:4, stage:3,
        q:'压杆l=2.5m，两端铰支(μ=1.0)，圆形截面d=50mm，E=210GPa，σ_p=200MPa，σ_s=235MPa，a=304MPa，b=1.12MPa。判断压杆类型并求F_cr。',
        ans:'大柔度杆(λ=200>λ_p=101.7), F_cr=101.7kN', svg:'bucklingPinnedPinned',
        explain:'i=d/4=12.5mm, λ=μl/i=2500/12.5=200。λ_p=π√(E/σ_p)=101.7。λ>λ_p→大柔度。F_cr=π²EI/(μl)²=101.7kN。' }
    ],

    // 阶段4：综合实战 - 模拟卷1（工程力学）
    mock1: [
      { id:'M01', type:'fill', chapter:'综合', difficulty:2,
        q:'平面任意力系向一点简化的结果为一个主矢R\'和一个主矩M_O。当R\'=0,M_O=0时，力系______。',
        ans:'平衡', explain:'R\'=0且M_O=0是力系平衡的充要条件。' },
      { id:'M02', type:'fill', chapter:'综合', difficulty:2,
        q:'偏心受压柱，若压力作用点在截面核心之内，则截面上只有______应力。',
        ans:'压', explain:'压力在截面核心内→中性轴在截面外→全截面受压。' },
      { id:'M03', type:'choice', chapter:'综合', difficulty:3,
        q:'用积分法求梁的挠曲线时，积分常数由（ ）确定',
        opts:['材料的弹性模量','截面的惯性矩','边界条件和连续条件','荷载的大小'], ans:2 },
      { id:'M04', type:'choice', chapter:'综合', difficulty:2,
        q:'对于大柔度压杆，临界力F_cr与（ ）成正比',
        opts:['l','l²','1/l','1/l²'], ans:3 },
      { id:'M05', type:'calc', chapter:'综合', difficulty:4,
        q:'柱高l=3m，两端铰支，空心圆管D=100mm d=80mm，E=200GPa，σ_s=235MPa，a=304MPa，b=1.12MPa，n_st=3。求：(1)压杆类型；(2)许用荷载[F]。',
        ans:'中柔度杆(λ=93.75), [F]=187.5kN', svg:'bucklingPinnedPinned',
        explain:'i=√(I/A)=32.0mm, λ=93.75。λ_s=61.6<λ<λ_p=99.3→中柔度杆。σ_cr=a-bλ=199MPa。F_cr=σ_cr×A=562.6kN。[F]=F_cr/3=187.5kN。' }
    ],

    // 阶段5：冲刺模考 - 模拟卷2（工程力学）
    mock2: [
      { id:'X01', type:'fill', chapter:'综合', difficulty:2,
        q:'二力杆的受力方向沿______方向。',
        ans:'杆两端铰接点连线（或杆轴线）', explain:'二力杆两端铰接，中间不受力，受力沿两端连线方向。' },
      { id:'X02', type:'choice', chapter:'综合', difficulty:3,
        q:'图示悬臂梁自由端受集中力P，力作用线不通过截面形心（偏心加载），则该梁的变形是（ ）',
        opts:['纯弯曲','轴向压缩+弯曲','弯曲+扭转','纯压缩'], ans:1, svg:'cantileverEccentric',
        explain:'偏心P可等效为过形心的轴向力（压缩）+力偶（弯曲）。' },
      { id:'X03', type:'choice', chapter:'综合', difficulty:3,
        q:'提高压杆稳定性的最有效措施是（ ）',
        opts:['增加杆长','减小截面惯性矩','改善约束条件以减小μ','使用强度更高的材料'], ans:2,
        explain:'F_cr∝1/μ²，改善约束直接增大临界力。对于大柔度杆，换高强度材料无效（E相同）。' },
      { id:'X04', type:'calc', chapter:'综合', difficulty:4,
        q:'简支梁l=8m，q=15kN/m，工字钢I=2.37×10⁸mm⁴，h=500mm，E=200GPa。(1)校核强度[σ]=160MPa；(2)求跨中最大挠度。',
        ans:'σ_max=126.6MPa<160MPa✓; v_max=16.9mm≈l/473', svg:'beamSimpleUniform',
        explain:'M_max=120kN·m, σ_max=126.6MPa。v_max=5ql⁴/(384EI)=16.9mm。' },
      { id:'X05', type:'calc', chapter:'综合', difficulty:3,
        q:'简支梁受集中力P=40kN（距A端2m，l=6m）和力偶M=30kN·m（距B端1m，逆时针）。求支座反力。',
        ans:'R_A=31.67kN(↑), R_B=8.33kN(↑)', svg:'beamSimplePoint',
        explain:'∑M_A=0→R_B=8.33kN, ∑F_y=0→R_A=31.67kN。' }
    ]
  },

  // ==================== 知识结构（按5阶段组织） ====================
  stageMap: {
    1: { // 基础学习
      name: '基础学习',
      icon: '📚',
      color: 'stage-1',
      desc: '静力学基础 → 材料力学入门 → 基本变形概述',
      chapters: ['第1章 静力学基础','第2章 平面汇交力系','第5章 材料力学基础'],
      kpIds: ['GC-001','GC-002','GC-003','GC-004','GC-005','GC-009','GC-010']
    },
    2: { // 专项攻坚
      name: '专项攻坚',
      icon: '🎯',
      color: 'stage-2',
      desc: '拉压 → 扭转 → 弯曲内力/应力/变形 → 截面几何性质',
      chapters: ['第6章 轴向拉伸与压缩','第7章 扭转','第8章 弯曲内力','第9章 弯曲应力','第10章 弯曲变形','第15章 截面几何性质'],
      kpIds: ['GC-011','GC-012','GC-013','GC-014','GC-015','GC-016','GC-017','GC-018','GC-019','GC-020','GC-025','GC-026']
    },
    3: { // 核心进阶
      name: '核心进阶',
      icon: '⚡',
      color: 'stage-3',
      desc: '力系简化与平衡 → 组合变形 → 压杆稳定',
      chapters: ['第3章 平面任意力系','第12章 组合变形','第13章 压杆稳定'],
      kpIds: ['GC-006','GC-007','GC-021','GC-022','GC-023','GC-024']
    },
    4: { // 综合实战
      name: '综合实战',
      icon: '🏆',
      color: 'stage-4',
      desc: '全真模拟卷训练 → 查漏补缺 → 错题回顾',
      chapters: ['全部章节'],
      kpIds: [],
      mockId: 'mock1'
    },
    5: { // 冲刺模考
      name: '冲刺模考',
      icon: '🚀',
      color: 'stage-5',
      desc: '限时模考 → 压轴题突破 → 考前冲刺',
      chapters: ['全部章节'],
      kpIds: [],
      mockId: 'mock2'
    }
  }
};

window.MechanicsData = MechanicsData;
