
        //宣告一個變數challengeData 型態為array(以"[]"框起來的內容為陣列（array))
        let challengeData = [];
        //宣告一個變數statKeys 型態為array
        const statKeys = [
            '物理Buff', '物理DeBuff', '物理破防', '物理總增益',
            '魔法Buff', '魔法DeBuff', '魔法破防', '魔法總增益',
            '護盾', '降攻', '冷卻加速(秒)', '減少冷卻(秒)',
            '降抗', '每秒回魔', '乘算動速', '加算動速',
            '扛吼/擋傷', '消火/解DeBuff', '霸體'
        ];           
        //宣告一個 async function 同步函數 名稱為loadData 讀取資料 同步函數可以避免資料讀取時網頁/程式卡住
        async function loadData() {
            //嘗試抓取資料challenge.json
            try {
                //fetch資料
                const response = await fetch('assets/json/challenge.json');
                //如果fetch失敗
                if (!response.ok) {
                    //送出HTTP錯誤訊息
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                //將資料存取到challengeData變數中
                challengeData = await response.json();
                //執行initializeTeams的function(函數）
                initializeTeams();
                //執行updateAllSummaries的function
                updateAllSummaries();
                
            //try語法 結束try內容並設定catch catch會抓取執行程式遇到的錯誤 但不會終止網站或程式整體的運作
            } catch (error) {
                //在控制台中印出錯誤訊息
                console.error('載入數據失敗:', error);
                //重新宣告challengeData的資料 大部分狀況為清空數據
                challengeData = [];
                //執行function
                initializeTeams();
                //執行function
                updateAllSummaries();
                //彈出訊息視窗 用法為alert("錯誤訊息");
                alert('無法載入 challenge.json，請確保檔案存在並與 index.html 同資料夾');
            //結束catch
            }
        //結束loadData
        }
        function formatState (state) {
            if (!state.id) { return state.text; }
            var $state = $(
                '<span><img src="assets/images/' +  state.element.value.toLowerCase() +
                '.png" class="img-flag" /> ' + state.text +'</span>');
            return $state;
        };
        //宣告一個function 函數 名稱為initializeTeams init通常為呼叫初始化的名稱
        function initializeTeams() {
            //宣告一個變數teamAContainer 設定為抓取頁面中id是teamA的物件（document.getElementById）
            const teamAContainer = document.getElementById('teamA');
            //宣告變數 同上
            const teamBContainer = document.getElementById('teamB');

            const teamATabs = document.getElementsByClassName("stats-labels-A");

            const teamBTabs = document.getElementsByClassName("stats-labels-B");
            
            //設定teamAContainer的屬性innerHTML為空 innerHTML為資料內全部的HTML資料
            teamAContainer.innerHTML = '';
            //設定資料 同上
            teamBContainer.innerHTML = '';
            
            //迴圈（循環動作） 設定i為0 結束條件為i大於4 每次迴圈結束後跑一次i++(i增加1）
            for (let i = 0; i < 4; i++) {
                //appendChild => 新增資料內容到teamAContainer 資料內容為呼叫function creatMemberRow
                teamAContainer.appendChild(createMemberRow('A', i));
                //同上
                teamBContainer.appendChild(createMemberRow('B', i));
            //結束for迴圈
            }
            $(".job-select").select2({
                templateResult: formatState
            });
            $(".job-select").on('select2:select',function(e){
                updateMemberStats($(this).data("team"), $(this).data("index"), e.target.value);
                updateAllSummaries();
            });
            for (let i = 0; i < teamATabs.length; i++){
                for (let j = 0; j < 4; j++) {
                    teamATabs[i].appendChild(createstatsValuesRow('A', i, j));
                    teamBTabs[i].appendChild(createstatsValuesRow('B', i, j));
                }                
            }
        //結束initializeTrams
        }
        
        //宣告一個 function 函數 名稱為creatMemberRow 要求兩個變數team和index 為避免資料為空的情況 建議可以設定一個預設值
        //ex: function creatMemberRow(team = 'A', index = 0)
        //有設定預設值的情況 不管資料有沒有錯誤都可以保證至少能跑
        function createMemberRow(team, index) {
            //宣告一個變數row 設定資料為一個新建的元素div
            const row = document.createElement('div');
            //設定row的className為member-row
            row.className = 'member-row';
            //宣告一個變數memberSelect 設定資料為一個新建的div
            const memberSelect = document.createElement('div');
            //設定memberSelect的class
            memberSelect.className = 'member-select';
            //設定memberSelect的HTML內容            
            memberSelect.innerHTML = `                
                <h4>成員 ${index + 1}</h4>
                <select class="job-select" data-team="${team}" data-index="${index}">
                    <option value="">職業</option>
                </select>
            `;            
            //將memberSelect加入row
            row.appendChild(memberSelect);

            //宣告一個變數select 設定資料為memberSelect資料內 class名為job-select的所有Element
            //querySelector不僅限抓取class 更改內容可依據id,欄位名稱如span/div等等的去抓取內容
            //適用於更新資料 如抓官網更新內容等
            const select = memberSelect.querySelector('.job-select');
            //const select = $(`#job-select-${team}-${index}`);
            //設定select一個觸發條件(change) 如果達成條件就執行內部程式 觸發條件包含change,click等等的動作
            select.addEventListener('change', (e) => {
                //執行updateMemberStats的函數
                updateMemberStats(team, index, e.target.value);
                //執行updateAllSummaries的函數
                updateAllSummaries();
            //結束設定
            });
            
            
            //判斷challengeData內的資料長度大於0（challengeData為陣列 此處指陣列內容物數量）
            if (challengeData.length > 0) {
                //迴圈 遍歷challengeData的內容 並設定每一個單獨的陣列內容物為共用的變數job
                challengeData.forEach(job => {
                    //宣告一個變數option 設定資料為一個新的option(下拉式選單的選項）
                    const option = document.createElement('option');
                    //設定option的value屬性為job陣列的編號（此處為下拉式選單選中後 實際選中讓後段判斷的數值）
                    option.value = job['編號'];
                    //設定option的文字內容為job陣列的職業（此處為下拉式選單給前端使用者看見的選項文字）
                    option.textContent = job['職業'];
                    //將option新增到select內
                    select.append(option);
                    //結束遍歷
                });
            //結束判斷
            }
            //回傳變數row
            return row;
        //結束function
        }
        function createstatsValuesRow(team, index, c) {
            //宣告一個變數row 設定資料為一個新建的元素div
            const row = document.createElement('div');
            //設定row的className為member-row
            row.className = 'member-row';            
            //宣告一個變數statsValues 設定資料為一個新建的div
            const statsValues = document.createElement('div');
            //設定statsValues的class
            statsValues.className = 'stats-values';
            //設定statsValues的id
            statsValues.id = `${team}-member-${index}-${c}-stats`;
            //迴圈（循環動作）遍歷statKeys 
            statKeys.forEach(key => {
                //宣告一個變數valueSpan 設定資料為一個新建的span
                const valueSpan = document.createElement('span');
                //設定valueSpan的class
                valueSpan.className = 'stat-value';
                //設定valueSpan的data-stat屬性                
                valueSpan.setAttribute('data-stat', key);
                switch(key){
                    case "物理Buff":
                    case "物理DeBuff":
                    case "物理破防":
                    case "物理總增益":
                        valueSpan.classList.add("physics");
                        break;
                    case "魔法Buff":
                    case "魔法DeBuff":
                    case "魔法破防":
                    case "魔法總增益":
                        valueSpan.classList.add("magical");
                        break;
                    case "降抗":
                    case "每秒回魔":
                    case "扛吼/擋傷":
                    case "消火/解DeBuff":
                    case "霸體":
                        valueSpan.classList.add("detail");
                        break;
                }
                //設定valueSpan的文字內容
                valueSpan.textContent = '-';
                //將valueSpan加入statsValues
                statsValues.appendChild(valueSpan);
            //結束迴圈
            });            
            //將statsValues加入row
            row.appendChild(statsValues);
            //回傳變數row
            return row;
        //結束function
        }
        //宣告一個function 名稱updateMemberStats 包含三個變數
        function updateMemberStats(team, index, jobId) {
            for(let j = 0; j < 3 ;j++ ){
            //宣告一個變數statsContainer 內容為抓取頁面id為${team}-member-${index}-stats的Element
            const statsContainer = document.getElementById(`${team}-member-${j}-${index}-stats`);
            //宣告一個變數jobData 內容為判斷式：如果jobId存在 
            //則內容為 在challengeData中設定每組內容都為job 當job內的編號與jobId相同時 設定為這組job
            //如果jobId為空 則jobData為null
            const jobData = jobId ? challengeData.find(job => job['編號'] === jobId) : null;
            //宣告一個變數valueSpans 內容為statsContainer內 class為stat-value的Element
            const valueSpans = statsContainer.querySelectorAll('.stat-value');
            //遍歷valueSpans 並將內容設定為span 迴圈座標index設定為i
            valueSpans.forEach((span, i) => {
                //宣告一個變數key 內容為statsKeys陣列中的第i項
                const key = statKeys[i];
                //宣告一個變數value 內容為判斷式：如果jobData和jobData陣列中的key存在 則內容為jobData[key] 否則內容為-
                const value = jobData && jobData[key] ? jobData[key] : '-';
                //設定span的文字內容為value
                span.textContent = value;
            //結束遍歷
            });
            }
        //結束function
        }
        //宣告一個function 名稱為calculateTeamStats 包含一個變數team
        function calculateTeamStats(team) {
            //宣告一個變數teamStats 內容為一個空陣列
            const teamStats = {};
            //宣告一個變數selects 內容為頁面中class為job-select[data-team="${team}"]的Element
            const selects = document.querySelectorAll(`.job-select[data-team="${team}"]`);
            //遍歷statKeys
            statKeys.forEach(key => {
                //設定teamStats的key欄位為0
                switch(key){
                    case "物理Buff":
                    case "物理DeBuff":
                    case "物理破防":
                    case "物理總增益":
                    case "魔法Buff":
                    case "魔法DeBuff":
                    case "魔法破防":
                    case "魔法總增益":
                        teamStats[key] = 100;
                        break;
                    default:
                        teamStats[key] = 0;
                        break;
                }
            //結束遍歷
            });
            //遍歷selects並設定內容為select
            selects.forEach(select => {
                //宣告一個變數jobId 設定為select的value屬性
                const jobId = select.value;
                //如果jobId存在（內容不為空
                if (jobId) {
                    //宣告一個變數jobData 內容為challenge中job["編號"]等於jobId
                    const jobData = challengeData.find(job => job['編號'] === jobId);
                    //如果jobData存在
                    if (jobData) {
                        //遍歷statKeys
                        statKeys.forEach(key => {
                            //宣告一個變數value 設定為jobData陣列中編號為key的資料                            
                            const value = jobData[key];
                            switch(key){
                                case "物理Buff":
                                    switch(document.getElementById(`damage-type-${team}`).value){
                                        case "A":teamStats[key] *= (100+parseFloat(value.replace('%', '')))/100;break;
                                        case "B":break;
                                        case "C":break;
                                        case "D":break;
                                        case "E":break;
                                        case "F":break;
                                        case "G":break;
                                    }
                                    break;
                                case "物理DeBuff":teamStats[key] *= defaultcalculate(value);break;
                                case "物理破防":teamStats[key] *= defaultcalculate(value);break;
                                case "物理總增益":teamStats[key] *= defaultcalculate(value);break;
                                case "魔法Buff":teamStats[key] *= defaultcalculate(value);break;
                                case "魔法DeBuff":teamStats[key] *= defaultcalculate(value);break;
                                case "魔法破防":teamStats[key] *= defaultcalculate(value);break;
                                case "魔法總增益":teamStats[key] *= defaultcalculate(value);break;
                                case "降抗":teamStats[key] *= defaultcalculate(value);break;
                                case "每秒回魔":teamStats[key] *= defaultcalculate(value);break;
                                case "扛吼/擋傷":teamStats[key] *= defaultcalculate(value);break;
                                case "消火/解DeBuff":teamStats[key] *= defaultcalculate(value);break;
                                case "霸體":teamStats[key] *= defaultcalculate(value);break;
                                default:
                                    break;
                            }                            
                        //結束遍歷
                        });
                    //結束if
                    }
                //結束if
                }
            //結束遍歷
            });
            //返回teamStats
            return teamStats;
        //結束function
        }
        function defaultcalculate(value){
            if (value && value !== '') {
                if (typeof value === 'string' && value.includes('%')) {
                    const numValue = parseFloat(value.replace('%', ''));
                    if (!isNaN(numValue)) {
                        return (100+numValue)/100;
                    }
                }else if (!isNaN(parseFloat(value))) {
                    return (100+parseFloat(value))/100;
                }else if (!isNaN(parseInt(value))) {
                    return (100+parseInt(value))/100;
                }
            }
            return 1;
        }
        //宣告一個function 名稱為updateAllSummaries
        function updateAllSummaries() {
            //宣告一個變數 名稱為teamAStats 設定為function calculateTeamStats回傳的資料
            const teamAStats = calculateTeamStats('A');
            //宣告一個變數 名稱為teamBStats 設定為function calculateTeamStats回傳的資料
            const teamBStats = calculateTeamStats('B');
            //宣告一個變數 名稱為totalStats 型態為陣列
            const totalStats = {};
            //遍歷statKeys
            statKeys.forEach(key => {
                //設定totalStats的key為teamAStats[key]或0(避免無資料)+teamBStats[key]或0
                totalStats[key] = (teamAStats[key] || 0) + (teamBStats[key] || 0);
            //結束遍歷
            });
            //執行updateSummaryDisplay的函數
            updateSummaryDisplay('teamA-summary', teamAStats);
            //執行updateSummaryDisplay的函數
            updateSummaryDisplay('teamB-summary', teamBStats);
            //執行updateSummaryDisplay的函數
            updateSummaryDisplay('total-summary', totalStats);
        //結束function
        }
        //宣告一個function 名稱為updateSummaryDisplay 包含兩個變數elementId和stats
        function updateSummaryDisplay(elementId, stats) {
            //宣告一個變數container 設定為抓取頁面id為elementId
            const container = document.getElementById(elementId);
            //宣告一個變數html 設定為空
            let html = '';
            //遍歷statKeys
            statKeys.forEach(key => {
                //宣告一個變數value 設定為stats[key]或0(避免無資料)
                const value = stats[key] || 0;
                //宣告一個變數displayValue 設定為'-'
                let displayValue = '-';
                //如果value不為0
                if (value !== 0) {
                    //如果key的文字包含Buff "或" 增益...etc
                    if (key.includes('Buff') || key.includes('增益') || 
                        key.includes('護盾') || key.includes('降攻') || 
                        key.includes('回魔') || key.includes('動速')) {
                        //變數displayValue設定為value的小數點後1位加上'%'的字元
                        displayValue = value.toFixed(2) + '%';
                    //如果key的文字包含秒
                    } else if (key.includes('秒')) {
                        //變數displayValue設定為value的小數點後2位加上'%'的字元
                        displayValue = value.toFixed(2);
                    //如果key的文字包含降抗
                    } else if (key.includes('降抗')) {
                        //變數displayValue設定為value四捨五入
                        displayValue = Math.round(value);
                    //如果key的文字包含霸體,扛吼,消火
                    } else if (key.includes('霸體') || key.includes('扛吼') || key.includes('消火')) {
                        //變數displayValue設定為value四捨五入
                        displayValue = Math.round(value);
                    //以上條件都不符合時 執行以下程式碼
                    } else {
                        //變數displayValue設定為value的小數點後1位加上'%'的字元
                        displayValue = value.toFixed(2) + '%';
                    //結束if
                    }
                //結束if
                }
                //設定html的內容
                html += `
                    <div class="summary-stat">
                        <span class="stat-name">${key}:</span>
                        <span class="stat-total">${displayValue}</span>
                    </div>
                `;
            //結束遍歷
            });
            //設定container的innerHTML屬性為html
            container.innerHTML = html;
        //結束function
        }
        //設定id為armor-pen-shoes-A的Element一個觸發條件(change) 如果達成條件就執行內部程式 
        document.getElementById('armor-pen-shoes-A').addEventListener('change', (e) => {
            //設定id為armor-pen-shoes-A的Element的disabled屬性為!e.target.checked(true或false)
            document.getElementById('armor-pen-value-A').disabled = !e.target.checked;
            //如果!e.target.checked(true或false)
            if (!e.target.checked) {
                //設定id為armor-pen-shoes-A的Element的value屬性為''
                document.getElementById('armor-pen-value-A').value = '';
            //結束if
            }
        //結束條件設定
        });
        //設定id為armor-pen-shoes-B的Element一個觸發條件(change) 如果達成條件就執行內部程式 
        document.getElementById('armor-pen-shoes-B').addEventListener('change', (e) => {
            //設定id為armor-pen-shoes-B的Element的disabled屬性為!e.target.checked(true或false)
            document.getElementById('armor-pen-value-B').disabled = !e.target.checked;
            //如果!e.target.checked(true或false)
            if (!e.target.checked) {
                //設定id為armor-pen-shoes-B的Element的value屬性為''
                document.getElementById('armor-pen-value-B').value = '';
            //結束if
            }
        //結束條件設定
        });        
        //頁面載入時(DOMContentLoaded)執行function"loadData"
        document.addEventListener('DOMContentLoaded', loadData);
        $( function() {            
            $( "#tabs-A" ).tabs();
            $( "#tabs-B" ).tabs();
            $( ".team-settings" ).accordion({collapsible: true,active: false,});
            $( "#title-19-4-A" ).on("change",function(){
                if(this.checked) {
                   $( "#armor-pen-shoes-A" ).prop('disabled', true);
                   $( "#death-title-A" ).prop('disabled', true);
                   $( "#armor-pen-shoes-percent-A" ).prop('disabled', true);
                   $( "#dark-shadow-A" ).prop('disabled', true);
                }else{
                    $( "#armor-pen-shoes-A" ).prop('disabled', false);
                   $( "#death-title-A" ).prop('disabled', false);
                   $( "#armor-pen-shoes-percent-A" ).prop('disabled', false);
                   $( "#dark-shadow-A" ).prop('disabled', false);
                }
            });
            $( "#title-19-4-B" ).on("change",function(){
                if(this.checked) {
                   $( "#armor-pen-shoes-B" ).prop('disabled', true);
                   $( "#death-title-B" ).prop('disabled', true);
                   $( "#armor-pen-shoes-percent-B" ).prop('disabled', true);
                   $( "#dark-shadow-B" ).prop('disabled', true);
                }else{
                    $( "#armor-pen-shoes-B" ).prop('disabled', false);
                   $( "#death-title-B" ).prop('disabled', false);
                   $( "#armor-pen-shoes-percent-B" ).prop('disabled', false);
                   $( "#dark-shadow-B" ).prop('disabled', false);
                }
            });
            
            
        } );
