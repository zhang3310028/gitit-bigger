<div class="panel panel-default" id="main">
    <div class="panel-body" id="content">
        <h1 class="pageTitle">
            <a href="$base$$pageUrl$">$pagetitle$</a>
            $if(revision)$
                <small class="revision">Revision $revision$</small>
            $endif$
        </h1>
        $if(messages)$
            <div class="messages">
                $messages:message()$
            </div>
        $endif$

        $content$

        <a class="scrollup clearfix" href="#">↑ Top</a>
	<a id="collapse" style="position:fixed;top:30px;right:5px" class="scrollup">[+/-]</a>
    </div>
</div>
