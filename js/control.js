
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}


console.log("Begin...");
var curPage = location.pathname;
switch(curPage)
{
	case "/problemsets.page":
		getProblemset(2);
		break;
	case "/problemset.page":
		getProblem(3);
		break;
	case "/problem.page":
		getInput();
		break;
	default:
		//if(curPage.length > 2) window.close();
		break;
}

function mathLink(link, reg)
{
	return link.search(reg) >= 0;
}

// 获取页面列表的所有符合规则的链接
function getLinks(reg)
{
	var lstLink = [];
	var count = 0;
	var tb = document.getElementsByClassName("table")[0];
	var lstA = tb.getElementsByTagName("a");
	for(var i = 0; i < lstA.length; i++)
	{
		if(!lstLink.contains(lstA[i].href) && mathLink(lstA[i].href, reg))
			lstLink[count++] = lstA[i].href;
	}
	return lstLink;
}

// 创建一个隐藏的iframe
function createIframe(name)
{
	var ifr = document.createElement("iframe");
	ifr.style.display = "none";
	ifr.name = name;
	ifr.id = name;
	ifr.src = "";
	document.body.appendChild(ifr);
}

// 在隐藏iframe中打开链接
function openByFrame(link)
{
	var ifrName = "lanqiaoEx_iframe_open_window";
	var ifr = document.getElementById(ifrName);
	if(null == ifr) createIframe(ifrName);
	return window.open(link, "_blank");
}

// 打开下一个页面
function openNext()
{
	if(_curLink == _lstLink.length && opener)
	{
		opener.openNext();
		window.close();
	}
	else if(_curLink == _lstLink.length)
	{
		alert("下载完成！立即查看>>>");
		chrome.downloads.showDefaultFolder();
	}
	openByFrame(_lstLink[_curLink++]);
}

// 试题集页面执行的链接
function getProblemset()
{
	_lstLink = getLinks(/problemset\.page/);
	_curLink = 0;
	openNext();
}

function getProblem()
{
	console.log(location.href);
	_lstLink = getLinks(/problem\.page/);
	_curLink = 0;
	openNext();
}

function getInput()
{
	console.log(location.href);
	var content = document.getElementsByClassName("des")[0].innerHTML;
	var title = document.getElementsByClassName("tit")[0].innerHTML;
	var search = getArgs();
	content = "<meta charset='utf-8'/>" + content;
	content = "<title>" + title + "</title>" + content;
	downloadFile("Problem/" + search.gpid + ".html", content);
 	for(var i = 1; i <= 10; i++)
		downloadInput(search.gpid, i);
}

function downloadFile(fileName, content){
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

function getArgs() 
{ 
    var args  = new Object(); 
    var query = window.location.search.substring(1); 
    var pairs = query.split("&"); 
    for(var i = 0; i < pairs.length; i++)
    { 
        var pos = pairs[i].indexOf('='); 
        if (pos == -1) continue; 
        var argname = pairs[i].substring(0,pos); 
        var value = pairs[i].substring(pos+1); 
        value = decodeURIComponent(value); 
        args[argname] = value; 
    } 
    return args; 
}

function downloadInput(pid, did)
{
	var filename = "input-" + pid + "-" + did + ".txt";
 	$.post("http://lx.lanqiao.org/lanqiao.DownloadData.dt", {type:"inp",gpid:pid,idx:did}, function(obj) {
		if(undefined == obj["handle"])
		{
			opener.openNext();
		}
		$.get("http://lx.lanqiao.org/web.RequireTempFile.do?handle=" + obj["handle"], function(content){
			downloadFile(filename, content);
			if(did == 10)
			{
				opener.openNext();
			}
		});
	}, "JSON");
}
