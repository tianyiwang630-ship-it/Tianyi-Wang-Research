/* 内容来源见 SOURCE_NOTES.md。所有指标保留原实验的评估范围。 */
window.portfolio = {
  name: '王天一', englishName: 'Tianyi Wang', email: 'twang121@usc.edu',
  github: ['number33550336-alt', 'tianyiwang630-ship-it'],
  education: [
    { school: '南加州大学', en: 'University of Southern California', degree: '数据科学 · 硕士在读', period: '2025.09 — 2027.07', mark: 'USC', text: '以数据科学为学习主线，通过机器学习课程实验开展特征工程、分类与回归、模型比较和深度学习实践。', courses: ['机器学习课程实验', '深度学习与迁移学习实践', '数据分析与模型评估'] },
    { school: '香港中文大学（深圳）', en: 'The Chinese University of Hong Kong, Shenzhen', degree: '量化金融 · 本科', period: '2021.09 — 2025.06', mark: 'CUHK(SZ)', text: '建立数学、统计与金融基础，并通过量化回测、客户转化预测和行业研究，将分析方法应用于具体问题。', courses: ['线性代数', '统计推断', '计量经济学', '最优化', '随机过程', '投资组合', '期权与期货', '数据结构与 C/C++'] }
  ],
  projects: [
    {
      id: 'jute-pest', title: '深度学习：17 类害虫图像分类', en: 'Transfer Learning · Model Comparison', category: '机器学习', type: '课程 Final Project', tags: ['PyTorch', 'torchvision', '迁移学习', '模型评测'], featured: true, visual: 'vision',
      summary: '以 PyTorch 构建图像分类实验，比较五种预训练网络，完成数据增强、分类头训练与多指标评估。',
      question: '面对同一个细粒度图像分类任务，不同预训练网络的迁移表现有什么差异？',
      contribution: '实现图像预处理与 DataLoader、统一模型构建接口、训练循环、早停和评测函数；在同一任务中比较五种网络。',
      metrics: [['17', '分类类别'], ['5', '预训练网络'], ['0.9538', 'ResNet-101 测试 Macro-F1']],
      sections: [
        ['问题与数据', '使用 Jute Pest Dataset 完成 17 类黄麻害虫识别。数据按 train、val、test 目录读取，保留独立验证与测试流程。训练数据使用随机裁剪、旋转、平移和对比度扰动；验证与测试数据统一调整到 224 × 224，并使用 ImageNet 均值与标准差归一化。'],
        ['模型与训练实现', '比较 ResNet-50、ResNet-101、EfficientNet-B0、VGG16 和 DenseNet-201。冻结预训练骨干参数，替换分类头为 Linear → BatchNorm → ReLU → Dropout → Linear。使用交叉熵与 Adam（学习率 0.001），训练最多 50 个 epoch；验证损失连续 10 个 epoch 无改善时早停，恢复验证损失最低的权重。'],
        ['实验结果与判断', '原始 Notebook 中 ResNet-101 的测试 Macro-F1 为 0.9538，ResNet-50 为 0.9425。在这次实验中，两种 ResNet 的测试 F1 高于其他三种模型。评测同时保留 Precision、Recall 和多分类 OVR Macro-AUC，避免只用单一指标描述性能。'],
        ['实验范围与后续问题', '这些指标来自已保存的课程实验输出，属于指定数据划分下的一次模型比较。训练集指标在增强后的输入上计算，因此不能直接与无增强测试集等同解读。后续可进一步检查近重复图像、类别级错误，以及多随机种子下的稳定性。']
      ],
      repo: 'https://github.com/number33550336-alt/machine-learning-final',
      sources: [],
      table: { caption: '原始 Notebook · 测试集指标', columns: ['模型', 'Macro Precision', 'Macro Recall', 'Macro-F1', 'Macro-AUC'], rows: [['ResNet-50', '0.9446', '0.9437', '0.9425', '0.9990'], ['ResNet-101', '0.9555', '0.9547', '0.9538', '0.9989'], ['EfficientNet-B0', '0.8905', '0.8802', '0.8795', '0.9938'], ['VGG16', '0.8852', '0.8656', '0.8690', '0.9919'], ['DenseNet-201', '0.9331', '0.9182', '0.9207', '0.9986']] }
    },
    {
      id: 'sandrone', title: 'Sandrone AI：多智能体与长期记忆', en: 'Agent Runtime · Collaboration · Memory', category: 'AI 智能体', type: '独立 AI 项目', tags: ['Python', 'FastAPI', 'React', 'Electron', 'MCP'], featured: true, visual: 'agent',
      summary: '围绕独立 Agent 协作、可恢复执行和可追溯记忆，构建面向真实工作流的本地智能体系统。',
      question: '如何让 Agent 在持续工作中协作、恢复任务，并从过去的记录中形成可修订的经验？',
      contribution: '设计个人办公 Agent 产品，探索多 Agent 协作与自进化记忆；公开仓库提供统一 Runtime、会话编排、上下文、工具与权限机制。',
      metrics: [['独立实例', 'Agent 身份与上下文'], ['双角色', '记忆整理与审核'], ['可恢复', '会话与运行检查点']],
      sections: [
        ['研究问题', '单次对话难以持续理解工作背景，也不能自然承担跨任务协作。项目把模型、会话、工具、工作区和运行状态组织成持续运行的系统，探索如何让 Agent 真正参与任务推进与用户思考。'],
        ['多 Agent 协作', '每个 Agent 拥有独立身份、历史、上下文与运行检查点，并共享指定项目工作区。消息在执行的安全输入边界进入；空闲实例能够被新任务唤醒。执行进程独立管理，同一实例只运行一个循环，支持引导、等待、停止与实例间通信。'],
        ['可修订的长期记忆', '记忆分为用户背景、通用经验和 Skill references。整理 Agent 从日志中提出修改，审核 Agent 回到原始记录核对，再通过受限工具新增、合并、修订或删除。该机制更新外部记忆文档，不修改模型参数。'],
        ['工程实现与边界', 'CLI、Web 与 Electron 共用 FastAPI 控制面及 Agent Runtime。执行循环负责模型调用、工具结果、中断与检查点；上下文管理器压缩较早历史并保留近期状态。权限与工作区边界贯穿工具执行。公开架构说明提供实现证据；多 Agent 对判断质量的增益仍需要独立、可重复的任务评测。']
      ], repo: 'https://github.com/tianyiwang630-ship-it/Sandrone-beta1',
      sources: [['Runtime 实现', 'https://github.com/tianyiwang630-ship-it/Sandrone-beta1/blob/main/agent-alpha/agent/core/agent_runtime.py'], ['多 Agent 思辨记录', 'https://mp.weixin.qq.com/s/u8lLn7aURUJiYrAAm4467A'], ['macOS 版本', 'https://github.com/tianyiwang630-ship-it/Sandrone-beta1-mac']]
    },
    {
      id: 'voxdrop', title: 'VoxDrop 言落：本地语音模型评测', en: 'ASR Benchmark · Local Inference', category: 'AI 系统', type: '独立 AI 项目', tags: ['ASR', 'MLX', 'Python', 'SwiftUI', 'Benchmark'], featured: true, visual: 'asr',
      summary: '构建统一语音评测流程，比较五类模型的识别质量、速度和资源成本，将实验结论落地为本地语音输入工具。',
      question: '在本地语音输入场景中，如何同时权衡识别准确率、推理速度、内存与个性化热词？',
      contribution: '自建测试集、统一评测脚本与热词 A/B 实验，完成模型选型，并开发本地语音输入产品。',
      metrics: [['5', '模型路线'], ['10 条', '自建评测语音'], ['2.26%', 'Qwen 开热词后 MER']],
      sections: [
        ['评测数据与指标', '评测集包含 10 条语音、五类场景，总时长 227.256 秒，覆盖中文、英文、中英混输、专业词和长句。中文按字、英文按词计算错误率，统一汇总为 MER；忽略大小写和标点，不将数字的不同表达视作语义等价。另记录 RTF、加载时间、推理延迟、模型体积和内存。'],
        ['模型比较与选型', '比较 faster-whisper Base INT8、Qwen3-ASR 0.6B MLX 4bit、SeACo-Paraformer、Sherpa Zipformer 和 Nemotron。Qwen 在该数据上的基础 MER 为 2.64%；SeACo 的 RTF 为 0.023，速度更快；Sherpa 资源占用更小。最终选择 Qwen 为 Apple Silicon MVP 主模型，基于准确率与资源约束做综合判断。'],
        ['热词实验', '对同一批语音比较热词开关。Qwen 热词召回率由 75.0% 提升到 87.5%，整体 MER 由 2.64% 降到 2.26%。Whisper 的热词召回提高，但整体 MER 略升，说明局部术语收益需要结合整体错误率判断。'],
        ['本地产品实现与评测范围', '产品使用 Swift / SwiftUI 与 Python / MLX Worker，支持全局快捷键、光标处粘贴、热词管理和本地转写历史。评测属于 10 条自建语音上的设备内比较，不能代表通用 ASR 排名；Qwen 内存使用 Metal peak memory，其他模型使用进程峰值 RSS，口径有所不同。']
      ], repo: 'https://github.com/tianyiwang630-ship-it/Voxdrop',
      sources: [['完整评测报告', 'https://github.com/tianyiwang630-ship-it/Voxdrop/blob/main/results/ASR_Benchmark报告.md'], ['评分实现', 'https://github.com/tianyiwang630-ship-it/Voxdrop/blob/main/benchmark/score.py'], ['下载发行版', 'https://github.com/tianyiwang630-ship-it/Voxdrop/releases/tag/v0.1.0']],
      table: { caption: '自建 10 条语音 · 基础模式比较（错误率越低越好）', columns: ['模型', 'MER', 'RTF', '热词后 MER'], rows: [['Qwen3-ASR MLX 4bit', '2.64%', '0.084', '2.26%'], ['SeACo-Paraformer INT8', '5.40%', '0.023', '5.53%'], ['Sherpa Zipformer INT8', '8.29%', '0.054', '8.54%'], ['Nemotron 0.6B Q8', '11.81%', '0.105', '11.68%'], ['faster-whisper Base INT8', '18.09%', '0.104', '18.84%']] }
    },
    {
      id: 'quant-backtest', title: '量化策略：模块化因子回测', en: 'Factor Construction · Backtesting', category: '量化金融', type: '金融编程项目', tags: ['Python', 'pandas', 'scikit-learn', 'yfinance'], featured: true, visual: 'quant',
      summary: '从行情获取到滚动因子、信号生成和策略比较，构建可调整窗口与交易阈值的股票回测流程。',
      question: '如何将一个价格关系假设转成可计算、可配置、可检查的策略实验？',
      contribution: '实现数据获取、最高最低价滚动回归因子、交易信号、持仓与收益计算，以及多组策略比较和绘图。',
      metrics: [['滚动回归', '因子构造'], ['次日开盘', '股票策略交易时点'], ['模块化', '窗口与阈值配置']],
      sections: [
        ['因子假设与数据', '通过 yfinance 获取行情，在滚动窗口内将最低价对最高价进行线性回归，以回归斜率 beta 表达高低价之间的关系。该 beta 是价格关系因子，不是资产对市场收益的 CAPM beta。'],
        ['信号与执行时序', '策略配置包含买入与卖出阈值、时间区间及回归窗口。根据当日因子生成信号，以移位后的持仓在下一日开盘进行交易；仓位在 0 和 1 之间切换。实现中把因子、信号、回测和图表分别封装，便于替换规则。'],
        ['结果呈现', 'Notebook 展示不同配置的总盈亏与持仓期间收益，并输出图表。通过统一函数比较参数组合，观察策略表现如何随窗口、阈值与样本区间变化。'],
        ['解释范围', '这是单因子、单股票的回测示例。现有结果用于展示研究流程与实现能力，不据此推断稳定超额收益；进一步研究需要明确交易成本、样本外验证和资金曲线的计算口径。']
      ], repo: 'https://github.com/number33550336-alt/quant', sources: []
    },
    {
      id: 'aps-failure', title: 'APS 故障预测：缺失值与类别不平衡', en: 'Imbalanced Classification · Tree Ensembles', category: '机器学习', type: '课程实验 · HW6', tags: ['Random Forest', 'XGBoost', 'SMOTE', 'Pipeline'],
      summary: '在缺失值与极不平衡传感器数据上比较随机森林、XGBoost、类别权重和 SMOTE。',
      question: '少数故障样本的漏检代价更高时，怎样比较模型和重采样策略？', contribution: '完成中位数填补、数据探索、树模型训练、参数选择、SMOTE Pipeline 和混淆矩阵分析。',
      sections: [['数据处理', 'APS 训练数据包含 59,000 个负类和 1,000 个正类样本。使用 SimpleImputer 做中位数填补，探索特征变异系数、相关性与分布，识别缺失值和类别不平衡对建模的影响。'], ['模型与实验', '比较随机森林及类别加权版本，再训练 XGBoost，通过交叉验证选择正则化参数。SMOTE 与模型结合为 imblearn Pipeline，并用 GridSearchCV 选择参数。'], ['结果与权衡', '原始输出中，XGBoost 测试 AUC 为 0.996474，故障类识别 285/375；SMOTE 版本测试 AUC 为 0.995616，故障类识别 315/375，但误报由 17 增至 47。重采样提高这次实验的召回，也改变了误报代价。'], ['研究判断', '整体准确率在负类占多数时容易掩盖漏检。将 AUC 与混淆矩阵一起报告，能看清方法对正类识别的影响；实际决策还需明确误报与漏报成本。']],
      repo: 'https://github.com/number33550336-alt/machine-learning-hw6', sources: []
    },
    {
      id: 'active-learning', title: '学习范式比较与主动学习', en: 'Supervised · Semi-supervised · Active Learning', category: '机器学习', type: '课程实验 · HW8', tags: ['SVM', 'Self-training', 'K-means', 'Monte Carlo'],
      summary: '通过重复数据划分比较不同学习范式，并以相同标注预算比较主动与被动 SVM 学习。',
      question: '标签数量与样本选择方式如何影响分类性能？', contribution: '实现监督、半监督与聚类实验，以及 50 次主动／被动学习重复实验与平均测试误差曲线。',
      sections: [['两个任务', '使用 Wisconsin 乳腺癌数据比较监督、半监督、K-means 与谱聚类；使用纸币认证数据比较被动抽样和主动 SVM 学习。'], ['重复实验设计', '分类比较使用 30 次数据划分。主动学习部分重复 50 次，固定测试样本数为 472，并逐步增加训练样本，通过平均测试误差观察学习过程。'], ['已记录结果', '乳腺癌任务原始输出中，监督 L1 SVM 平均测试准确率约 97.28%，自训练约 96.40%，K-means 约 90.56%，谱聚类约 65.38%。这些结果反映特定实现与参数设置，而非学习范式的普遍排序。'], ['比较与解释', '项目将标签获取过程纳入实验，比较相同样本预算下不同选择策略的误差。聚类标签映射、核参数及重复划分方式都影响结果，需要结合实验设置解释。']],
      repo: 'https://github.com/number33550336-alt/machine-learning-hw8', sources: []
    },
    {
      id: 'time-series', title: '传感器时间序列：活动识别', en: 'Feature Extraction · Time-series Classification', category: '机器学习', type: '课程实验 · HW4', tags: ['特征工程', 'Logistic Regression', 'Naive Bayes', '交叉验证'],
      summary: '对 AReM 传感器序列分段、提取统计特征，并比较二分类与多分类方法。',
      question: '怎样把不同长度的传感器序列转成可用于分类的统计特征？', contribution: '实现序列分段、统计特征提取、特征选择、正则化逻辑回归与朴素贝叶斯比较。',
      sections: [['特征构建', '对 AReM 活动记录按片段切分，提取统计量，将时序信号映射为固定长度特征。比较不同分段数量和特征选择设置对活动分类的影响。'], ['分类方法', '先做活动二分类，再扩展到多分类，比较 L1、L2 逻辑回归、Gaussian Naive Bayes 和 Multinomial Naive Bayes，并用交叉验证选择部分设置。'], ['结果', '原始实验中，L2 二分类测试准确率为 0.947368；多分类 L1 逻辑回归与 Gaussian Naive Bayes 的测试错误率均为 0.1579，Multinomial Naive Bayes 为 0.3158。'], ['实验意识', 'Notebook 讨论了特征选择必须在交叉验证训练折内进行，否则会利用验证标签。这个问题体现了实验设计中数据泄漏检查的重要性。']],
      repo: 'https://github.com/number33550336-alt/machine-learning-hw4', sources: []
    },
    {
      id: 'interpretable-models', title: '可解释决策树与正则化回归', en: 'Interpretability · Regularization · Regression', category: '机器学习', type: '课程实验 · HW5', tags: ['决策树', 'Ridge', 'LASSO', 'PCR', 'XGBoost'],
      summary: '将决策树转成可读规则，并在同一回归任务上比较正则化、降维和集成方法。',
      question: '怎样在可解释性、变量选择与预测误差之间做比较？', contribution: '实现多输出决策树规则导出与剪枝，并完成线性回归、Ridge、LASSO、PCR 和 Boosting 实验。',
      sections: [['可解释分类', '在急性炎症诊断数据上训练决策树，使用 cost-complexity pruning 简化结构，再把路径条件导出为可读规则，观察树复杂度与解释性的关系。'], ['回归比较', '对 Communities and Crime 数据处理缺失值、探索相关性，比较线性回归、Ridge、LASSO、主成分回归与 Boosting，并分析标准化对变量选择的影响。'], ['实验结果', '已保存输出中，Ridge 测试 MSE 为 0.017599，未标准化 LASSO 为 0.017570，PCR 为 0.018253，Boosting 为 0.015558。LASSO 在不同标准化设置下选出的变量数量也明显不同。'], ['解释范围', '这些是该数据划分和建模流程下的误差，不等同于因果结论。通过并列模型、变量选择和规则表示，展示方法比较与结果解释的过程。']],
      repo: 'https://github.com/number33550336-alt/machine-learning-hw5', sources: []
    },
    {
      id: 'frog-calls', title: '蛙鸣分类：SVM 与多标签评估', en: 'Multi-label SVM · Clustering', category: '机器学习', type: '课程实验 · HW7', tags: ['SVM', 'MFCC', 'K-means', 'Hamming Score'],
      summary: '使用声音 MFCC 特征预测蛙类科、属、种，比较核函数、标准化与重采样。',
      question: '一个声音样本对应多个分类层级时，怎样训练并评价预测结果？', contribution: '分别训练科、属、种 SVM 分类器，完成网格搜索、标准化、L1 与 SMOTE 对比及 K-means 分析。',
      sections: [['任务与指标', '使用 Anuran Calls 的 MFCC 特征，将 Family、Genus、Species 作为三个预测目标。Exact Match 要求一条样本的三个标签全部正确；Hamming Score 衡量标签位置层面的正确比例。'], ['方法比较', '划分 70% 训练与 30% 测试，比较 Gaussian kernel SVM、标准化版本、L1 线性 SVM，以及 SMOTE 重采样；使用 K-means 探索无监督聚类。'], ['实验结果', '原始输出中，未标准化核 SVM Exact Match 为 0.987494、Hamming Score 为 0.992280；标准化版本 Exact Match 为 0.986568。L1 与 SMOTE 版本在这次设置中表现更低，说明预处理的收益需要通过任务实测判断。'], ['分析范围', '项目同时关注分类层级一致性和局部错误。聚类结果需通过簇内多数标签映射解释，不能直接与监督分类视作同一训练条件。']],
      repo: 'https://github.com/number33550336-alt/machin-learning-hw7', sources: []
    },
    {
      id: 'stock-series', title: '股票时间序列分析工具', en: 'Rolling Regression · Residual Analysis', category: '量化金融', type: '金融编程项目', tags: ['Python', '回归分析', '滚动 R²', 'yfinance'],
      summary: '封装个股与市场指数、ETF 的关系分析，查看滚动解释度、残差与收益差异。',
      question: '个股收益在多大程度上能被市场基准解释，这种关系如何随时间变化？', contribution: '编写 stkSeries 类，集成行情获取、收益率回归、滚动 R²、残差和收益差绘图。',
      sections: [['分析对象', '通过 yfinance 下载个股及道琼斯、标普、纳斯达克与 QQQ 行情，按时间索引对齐，再将价格转为收益率。'], ['回归与滚动窗口', '使用 LinearRegression 计算单基准与多基准解释度；在历史窗口中重复拟合，汇总当前 R²、滚动均值、标准差和历史百分位。'], ['工具化实现', '将获取行情、市场关系分析、残差图与收益差图封装进 stkSeries，Notebook 使用类接口进行探索，减少重复数据处理。'], ['解释边界', 'R² 描述样本内线性解释度，不代表预测收益或因果关系。滚动窗口变化可以提示关系不稳定，也需要结合样本长度和基准共线性判断。']],
      repo: 'https://github.com/number33550336-alt/stock-series', sources: []
    },
    {
      id: 'bitcoin-backtest', title: '比特币趋势与均值回归回测', en: 'Trend Following · Mean Reversion', category: '量化金融', type: '金融编程项目', tags: ['ccxt', 'TA-Lib', 'EMA', 'Bollinger Bands'],
      summary: '组合趋势跟随与均值回归两类策略，记录仓位、交易、净值与回撤。',
      question: '如何把两种交易逻辑组织成可配置的回测系统，并分别跟踪其表现？', contribution: '实现 BitcoinQuantBacktest，包含行情分页获取、技术指标、两类仓位、止损、交易记录和结果绘图。',
      sections: [['数据与指标', '使用 ccxt 按时间区间分页获取 OHLCV，计算 EMA12、EMA20、布林带和 ADX，并清理指标初期的缺失记录。'], ['组合与状态管理', '资金分为趋势仓与均值回归仓，默认比例为 70% 与 30%。分别维护余额、仓位、入场价格和止损设置，交易事件保存到统一记录中。'], ['结果分析', '回测输出总收益、组合与分策略资金曲线、买卖及止损标记、最大回撤和交易次数，通过图表分析策略行为。'], ['研究边界', '现有脚本是历史行情上的策略演示。交易时点、手续费、滑点和样本外测试需要在正式策略研究中进一步明确，网站不将演示结果表述为实盘收益。']],
      repo: 'https://github.com/number33550336-alt/quant', sources: []
    },
    {
      id: 'agent-framework', title: 'Agent with MCP & Skills：可扩展运行框架', en: 'Tool Discovery · Context Management', category: 'AI 智能体', type: '独立 AI 项目', tags: ['Python', 'MCP', 'Skills', 'BM25', 'ReAct'],
      summary: '从工具加载、上下文压缩到权限控制，实现可嵌入产品的轻量智能体基础设施。',
      question: '怎样让一个 Agent 自动发现能力，同时控制工具规模和上下文成本？', contribution: '实现系统操作工具链、MCP 接入、Skills 动态发现、按需工具搜索、上下文与权限管理。',
      sections: [['系统分层', 'Agent Core 将 LLM Client、Tool Loader、Context Manager、Permission Manager 和 BM25 索引分离。工具层统一接入内置文件与命令工具、MCP 服务和 Skills。'], ['自动发现与检索', 'MCP 扫描器识别 Node.js、Python 等服务，通过 STDIO 或 HTTP 保持连接。核心工具常驻，垂直工具按需激活；BM25 为工具服务建立关键词索引，支持名称与别名检索。'], ['上下文管理', '较早历史压缩为包含任务时间线、工具变化、重要文件、当前状态、错误记忆和关键意图的结构化摘要，保留近期完整消息，以控制长会话的输入成本。'], ['工程边界', '将权限策略与工具执行分离，危险操作需要相应授权。框架可为桌面产品提供底座；当前文档与核心代码证明实现结构，执行可靠性需要结合具体任务测试评价。']],
      repo: 'https://github.com/tianyiwang630-ship-it/skill-mcp-agent', sources: [['BM25 实现', 'https://github.com/tianyiwang630-ship-it/skill-mcp-agent/blob/main/agent-alpha/agent/core/bm25.py'], ['另一账号的框架仓库', 'https://github.com/number33550336-alt/Skills-MCP-Agent-Framework']]
    },
    {
      id: 'paimon', title: 'Paimon Desktop：桌面任务执行 Agent', en: 'Desktop Agent · Human–Agent Interaction', category: 'AI 智能体', type: '独立 AI 项目', tags: ['Electron', 'React', 'FastAPI', 'SQLite', 'ReAct'],
      summary: '将工具调用、文件处理和文档交付组织为可中断、可恢复的桌面任务体验。',
      question: '如何让非技术用户使用具备真实执行能力的 Agent，完成文件与知识工作？', contribution: '进行产品设计与核心实现，组织任务界面、会话状态、MCP / Skill 能力和路径权限机制。',
      sections: [['目标与工作流', '面向频繁处理文件、网页信息和内容产出的知识工作者，支持资料收集、信息整理，以及 PPT、DOCX、XLSX 等文档输出。'], ['任务执行机制', 'Agent 通过 ReAct 循环调用文件、命令与外部工具；MCP 服务按分类加载，Skills 按需发现，历史压缩后继续执行。项目与会话绑定工作区，SQLite 保存会话和消息。'], ['交互与可控性', 'React 前端显示中间步骤，支持 Interrupt、Resume、会话级草稿缓存与 Slash 选项。权限请求经过确认后继续原任务，路径白名单与运行时目录保护约束文件操作。'], ['实现与产出', 'Electron 承载桌面界面，React / Vite 与 Zustand 管理前端状态，FastAPI 提供服务接口。项目提供功能截图和源码；跨任务完成率、恢复成功率可作为后续评测指标。']],
      repo: 'https://github.com/tianyiwang630-ship-it/Paimon-Desktop', sources: [['产品介绍', 'https://mp.weixin.qq.com/s/ROFR9b45T3n2xQl9UOFXsQ'], ['macOS 版本', 'https://github.com/tianyiwang630-ship-it/Paimon-mac']]
    },
    {
      id: 'classaudio', title: 'ClassAudio：课堂转写与结构化笔记', en: 'Streaming ASR · Contextual Vocabulary', category: 'AI 系统', type: '独立 AI 项目', tags: ['ASR', 'WebSocket', 'FastAPI', 'LLM', '热词'],
      summary: '把课堂主题、实时转写、专业词汇与结构化笔记串联起来，支持基于课堂内容的即时问答。',
      question: '如何减少专业术语识别错误，并让课堂音频转化为可复习、可追问的知识？', contribution: '设计课堂主题引导、专业词汇上下文、实时笔记整理与问答链路，完成应用开发。',
      sections: [['专业词汇上下文', '根据用户输入的课堂主题，用 LLM 生成相关术语，再注入语音识别的热词上下文。将领域知识前置到识别过程，改善专业词汇的处理。'], ['流式音频链路', '当前仓库使用 Nemotron 流式模型与本地 NeMo-Speech.cpp 运行时。即时片段用于字幕，最终句子进入后续整理；WebSocket 将状态和文本推送到页面。'], ['笔记与问答', '将转写内容整理为课程内容、知识点与问题讨论，并保持前后文衔接；用户可以围绕已经转写的内容继续提问。'], ['系统实现与版本', 'FastAPI 组织 Audio Service 与 LLM Service，前端使用原生 JavaScript。项目经历与公开仓库处于不同迭代阶段，详情描述以当前仓库的链路为参考；未把早期简历中的术语识别百分比当成当前版本的通用结论。']],
      repo: 'https://github.com/tianyiwang630-ship-it/ClassAudio', sources: [['早期版本', 'https://github.com/tianyiwang630-ship-it/ClassAudio---AI-Powered-Intelligent-Classroom-Transcription-System']]
    },
    {
      id: 'bank-conversion', title: '招商银行：客户转化预测与解释', en: 'Financial Data · XGBoost · SHAP', category: '金融与商业研究', type: '数字金融训练营大赛 · 2024.04', tags: ['数据清洗', '特征工程', 'XGBoost', 'SHAP'],
      summary: '从客户触达行为中构建转化预测模型，用解释性分析形成分层触达建议。',
      question: '哪些客户特征和触达方式与转化相关，模型分析怎样转成可执行建议？', contribution: '处理约 50 万条触达行为、分析 50 余项特征，构建交互变量，采用 XGBoost 与 SHAP 进行预测和解释。',
      sections: [['问题与数据', '客户经理触达缺少科学的分层策略。项目从客户画像、触达渠道和沟通频次等行为数据出发，清洗并分析约 50 万条记录。'], ['特征与模型', '构建渠道 × 年龄等交互变量，使用 XGBoost 建立转化预测模型，再用 SHAP 分析资产等级、响应率与渠道交互等因素。'], ['分析落地', '将模型洞察整理为分层触达 SOP 和差异化沟通建议。简历记录 F1 排名大赛前 30%，方案获得组委会认可。'], ['证据范围', '本页依据总简历中的项目经历；当前材料没有公开代码和完整验证记录，因此没有额外列出未核实的 AUC、F1 数值或业务提升比例。']],
      repo: '', sources: []
    },
    {
      id: 'ocean-park', title: '香港海洋公园：商业与财务研究', en: 'Strategy Research · Financial Forecasting', category: '金融与商业研究', type: '经管学院商业分析大赛 · 2024.10—11', tags: ['团队研究', 'SWOT', '财务预测', '行业分析'],
      summary: '结合市场资料、趋势数据与财务预测，研究海洋公园的战略选择。',
      question: '如何将市场判断与投资测算结合，为具体经营问题提供研究建议？', contribution: '作为团队负责人协调四名成员，主导战略研究并组织财务预测与展示。',
      sections: [['研究任务', '围绕香港海洋公园的市场竞争与增长机会开展案例分析，使用市场资料和 Google Trends 辅助研究。'], ['策略形成', '通过 SWOT 分析组织冒险区开发、大陆市场拓展和海洋主题差异化三项建议，比较不同方向的市场逻辑。'], ['财务测算与团队协作', '组织财务预测，估算投资回收期和收入潜力；协调成员分工、进度和最终演示。预测值是模型假设下的估算，未作为已实现经营结果展示。'], ['项目成果', '总简历记录项目获得二等奖。该案例展示问题拆解、资料研究、财务假设和团队交付能力。']],
      repo: '', sources: []
    },
    {
      id: 'ai-logs', title: 'AI 日志助手：对话式知识记录', en: 'State Machine · Personal Knowledge', category: 'AI 智能体', type: '开源实践项目', tags: ['LLM', 'FastAPI', '状态机', '上下文检索'],
      summary: '通过双阶段状态机将自然对话转成可确认、可分类、可检索的个人记录。', question: '怎样在自由聊天中可靠识别记录意图，并保留用户确认与修订的机会？', contribution: '公开仓库实现日志判断、草稿确认、四类存储、用户画像和历史记录检索。',
      sections: [['双阶段对话', 'S1 区分自由聊天与日志意图，识别日志后生成结构化草稿；S2 处理确认、修改或退出，确认后才写入对应文件。'], ['记录与检索', '数据分为任务、反馈、事件和目标。根据历史日志构建用户画像，通过文件索引选择相关记录，向对话注入上下文。'], ['系统实现', '原生 HTML / CSS / JavaScript 前端连接 FastAPI，Orchestrator 管理状态与 LLM 调用，纯文本和 JSON 存储便于查看与迁移。'], ['设计判断', '将记录草稿与持久写入分离，让用户能够检查分类和日期。公开说明展示了实现流程，意图识别准确率和检索质量尚未提供统一评测结果。']],
      repo: 'https://github.com/tianyiwang630-ship-it/AI-logs-assistant', sources: []
    },
    {
      id: 'rednote-mcp', title: 'Rednote MCP：浏览器工具改造', en: 'MCP Integration · Snapshot-driven Tools', category: 'AI 智能体', type: '基于开源项目的改造', tags: ['MCP', 'Playwright', 'TypeScript', '结构化快照'],
      summary: '基于现有开源项目修复浏览器交互问题，提供快照驱动的通用 MCP 工具。', question: '网页结构变化时，怎样减少自动化流程对固定选择器的依赖？', contribution: '仓库说明记录基于 iFurySt/RedNote-MCP 的导航、隐藏元素点击、登录与内容加载修复，以及快照提取改造。',
      sections: [['原项目与改造范围', '基于 iFurySt/RedNote-MCP 改造，明确保留上游来源。修复 xsec_token 导航、隐藏元素点击、登录浏览器崩溃和搜索内容加载时机问题。'], ['工具与快照', '提供浏览、搜索、点击、滚动、快照、返回、输入、按键和登录九类工具，输出结构化链接、按钮、输入和正文。'], ['运行机制', '使用共享浏览器实例与互斥锁串行化调用，通过快照让 Agent 判断下一步交互，减少对固定 CSS 选择器的依赖。'], ['工程判断', '该项目展示第三方代码阅读、故障定位与工具接口改造。平台变化仍会影响自动化稳定性，当前没有提供长期成功率统计。']],
      repo: 'https://github.com/tianyiwang630-ship-it/Rednote-MCP', sources: []
    },
    {
      id: 'loop-skill', title: 'Loop Skill：迭代思考结构', en: 'Reflection · Perspective Switching', category: 'AI 智能体', type: '开源方法实践', tags: ['Skills', '反思', '多轮执行', '方法设计'],
      summary: '为多轮 Agent 任务设计轻量的执行、反思、视角切换与验证流程。', question: '如何让多轮任务形成累积收益，而不是沿着单一路径重复修改？', contribution: '设计可复用 loop Skill 及模式、故障处理参考文档，将反思与横向比较嵌入任务推进。',
      sections: [['设计动机', '默认循环容易只优化当前答案、不重新检查目标，或将可见活动误作真实进展。Loop 从反思、视角切换和前后比较切入。'], ['迭代结构', '每轮包括执行、反思、视角切换、横向比较、验证与继续判断。它作为思考支架，与具体领域技能配合，而非独立任务编排器。'], ['资源组织', 'SKILL.md 提供入口，patterns.md 描述 refinement、accumulation 和 exploration 模式，troubleshooting.md 处理空转、漂移与过早结束。'], ['验证边界', '该项目是方法与提示结构设计，尚未提供对照实验来证明任务质量增益。可进一步用相同任务比较执行结果、成本与稳定性。']],
      repo: 'https://github.com/tianyiwang630-ship-it/skill-loop', sources: []
    }
  ],
  experience: [
    { id: 'ant', org: '蚂蚁集团', en: 'ANT GROUP', role: '支付宝事业群 · AI 产品经理', period: '2026.05 — 2026.08', sector: '互联网 / AI 搜索', summary: '建立 AI 搜索评测体系，以真实 Query 与 Bad Case 分析推动意图识别和检索策略优化。', points: [['LLM 评测体系', '基于真实 Query 搭建意图分类体系与六维评测标准，按线上分布抽取约 550 个 Query，使用 LLM-as-a-Judge 批量评测，定位意图理解、商品相关性与回答表达问题。'], ['识别与检索策略', '针对意图混淆和低相关召回，引入小参数 LLM 优化意图识别，设计商品分层降级策略，并通过 Bad Case 分析推动迭代。'], ['业务结果', '最新简历记录意图识别准确率由约 30% 提升至 90%，商品打偏率由 23% 降至 10% 以内，AI 搜索渗透率提升至三倍以上，曝光核销转化率相对提升约 16%。这些是所在业务链路的结果。']] },
    { id: 'meituan', org: '美团', en: 'MEITUAN', role: '金融服务部门 · 数据 / AI 产品经理', period: '2025.05 — 2025.08', sector: '互联网 / 金融科技', summary: '将 AI 应用于经营异动分析与金融产品推荐，连接数据处理、模型推理和业务判断。', points: [['经营分析', '围绕业务阵地、客群、指标和时间组织输入，串联查询、数据处理、异动分析与报告输出，支撑业务进行异常定位。'], ['模型选择与上下文', '针对异动分析选择 DS R1，利用历史案例构建 few-shot 提示词。推荐链路先压缩多源用户画像，再通过历史案例 RAG 增强产品匹配与对客表达。'], ['效果与贡献', '最新简历记录异常报告采纳率 90%+、召回率接近 100%；历史样本推荐命中率由 58% 提升至 82%。职责为数据 / AI 产品经理，重点是方案、评测与落地协作。']] },
    { id: 'atm', org: 'ATM CAPITAL', en: 'ATM CAPITAL', role: 'AI 产品实习生', period: '2024.12 — 2025.03', sector: '投资 / AI 资讯', summary: '为投研团队构建资讯抓取、筛选、分类与摘要流程，并参与数据集与模型训练。', points: [['投研问题与产品选型', '投资团队需要高频获取分散的 AI 行业资讯。调研产品与开发可行性，选用 Coze，搭建抓取、筛选、分类、摘要工作流。'], ['数据集与微调', '总简历记录组织训练数据并负责模型训练，资讯召回率由 60% 提升至 100%，分类准确率由 30% 提升至 80%。当前材料没有完整训练配置和独立测试记录。'], ['用户反馈与迭代', '根据日志与反馈定位延迟和答复准确性问题，推出定时推送与深度搜索。简历记录日均处理 300+ 条资讯，周活跃覆盖约 80% 投研团队。']] },
    { id: 'sdic', org: '国投证券', en: 'SDIC SECURITIES', role: '计算机研究所 · 行研实习生', period: '2024.05 — 2024.09', sector: '证券 / 行业研究', summary: '围绕电力改革与电力信息化开展资料研究、财务分析和报告支持。', points: [['专题研究', '在分析师指导下，从政府官网、企业招股说明书、论坛和研报收集资料，参与电力改革与电力信息化报告的大纲和底稿撰写。'], ['财务与经营分析', '结合财务报告和会议信息分析利润率等异常指标，梳理上市公司业务板块经营情况，并形成财务运营分析材料。'], ['数据与跟踪', '通过 Wind、iFinD 获取数据，跟踪公司公告，完成财务点评与投资日报。公开页面仅展示经历概述，不包含非公开会议材料。']] },
    { id: 'cinda', org: '信达澳亚基金', en: 'CINDA AUSTRALIA', role: '研究咨询部 · 投研实习生', period: '2023.05 — 2023.09', sector: '基金 / 投资研究', summary: '参与行业资料梳理、路演纪要与财务分析，建立研究问题和证据之间的联系。', points: [['行业研究', '在导师指导下收集研报、公司资料与媒体信息，参与深度行业报告撰写。总简历还记录了啤酒行业高端化趋势研究。'], ['分析方法', '梳理头部企业战略、产品价格带及美日市场不同价格段产量时间序列，结合多类资料分析行业变化。'], ['研究支持', '参加路演、撰写会议纪要并与导师讨论；结合财报绘制财务分析表，为投研判断提供资料支持。']] }
  ],
  articles: [
    { title: '多 Agent 电车难题思辨', subtitle: '通过多智能体讨论，探索不同视角如何参与判断。', tag: 'AI 智能体', url: 'https://mp.weixin.qq.com/s/u8lLn7aURUJiYrAAm4467A' },
    { title: 'Paimon Desktop 产品介绍', subtitle: '从对话辅助走向文件处理、工具执行与结果交付。', tag: '工程实践', url: 'https://mp.weixin.qq.com/s/ROFR9b45T3n2xQl9UOFXsQ' },
    { title: '天一的思考 · 更多文章', subtitle: '持续记录关于 AI、阅读与生活的思考。', tag: '公众号', url: 'https://mp.weixin.qq.com/s/WlZNMfmnLvUUwjf2Em6sBQ' }
  ]
};
