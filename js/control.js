console.log("Begin...");
var curPage = location.pathname;
switch(curPage)
{
	case "/problemsets.page":
		getProblemset(2);
		break;
	case "/problemset.page":
		getProblemset(3);
		break;
	case "/problem.page":
		getProblem();
		break;
	default:
		if(curPage.length > 2) window.close();
		break;
}

function getProblemset(step)
{
	var tb = document.getElementsByClassName("table")[0];
	var lstProblemset = tb.getElementsByTagName("a");
	for(var i = 0; i < lstProblemset.length; i += step)
	{
		window.open(lstProblemset[i].href, "_blank");
		console.log("Open " + lstProblemset[i].href);
	}
	window.close();
}

function getProblem()
{
	var content = document.getElementsByClassName("des")[0].innerHTML;
	var title = document.getElementsByClassName("tit")[0].innerHTML;
	var search = getArgs();
	content = "<meta charset='utf-8'/>" + content;
	content = "<title>" + title + "</title>" + content;
	downloadFile("Problem/" + search.gpid + ".html", content);
	var filename = "input-" + gpid + "-" + did + ".txt";
 	for(var i = 1; i <= 10; i++)
		downloadInput(gpid, i);
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
		$.get("http://lx.lanqiao.org/web.RequireTempFile.do?handle=" + obj["handle"], function(content){
			downloadFile(filename, content);
			if(did == 10) window.close();
		});
	}, "JSON");
}