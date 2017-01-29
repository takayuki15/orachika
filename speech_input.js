/*
    [speech_input.js]
    encoding="UTF-8"
*/


// Googleの音声入力用のクラス定義
//   ref. http://qiita.com/inouet/items/2c9e218c05f547bb6852
//   ref. http://www.cyokodog.net/blog/web-speechi-api/
//   ref. https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html 【公式Spec】
//
// noticeOverlay = null指定可能。その場合は、通知用divを自動生成。
// ,start() で、deferred が返るので、.done( text )で取得して任意に設定する。
//
// ※音声入力の実行可能不可能の自前判定は無いので、別途「スマホ／タブレットのみOK」などの
// 　処理を実装の事。
//
var SpeechInputWs = function( noticeOverlay ){
    var self = this;
    this.itsNoticeOverlayDiv = noticeOverlay;

    // 通知用のオーバーレイdivが無ければ自前で生成する。
    if( !this.itsNoticeOverlayDiv ){
        $("body").append( "<div id=\"_id_overlay_notice\">hoge</div>" );
        this.itsNoticeOverlayDiv = $("#_id_overlay_notice");
        this.itsNoticeOverlayDiv.css({
            "display" : "none",
            "width"   : "100%",
            "height"  : "100%",
            "text-align" : "left",
            "position"   : "fixed",
            "top"  : "0",
            "left" : "0",
            "z-index" : "100",
            "background-color": ""
        });
    }

    // 一応、毎回初期化？？？
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

    // オブジェクト生成
    this.itsRecognition = new webkitSpeechRecognition();
    this.itsRecognition.lang = 'ja';
    this.itsRecognition.maxAlternatives = 3;

    // 終了時に呼び出されるメソッドを設定
    this.itsRecognition.addEventListener("result", function(event){
        // この場面でのthisはグローバル扱いの可能性があるので、クロージャーのselfを経由しておく。
        self._selectTextFromSpeechResult( event.results );
    });
    this.itsLastDfd = null;
};
SpeechInputWs.prototype._selectTextFromSpeechResult = function( speechResult ){
    // ※予め、this.itsLastDfd にDeferred::promise() が入っている事。
    var dfd_notice = this.itsLastDfd;
    var candidate = speechResult.item(0);
    var i = candidate.length;
    var str;

    if ( i == 0 ){
        dfd.resolve( candidate.item(0).transcript );
        return dfd.promise();
    }

    // 【FIXME】あれ？ .maxAlternatives=3 が効いてない？？？
    if( i > 5 ){ i = 5; }

    // 候補を表示してユーザー入力を待つ。
    str = ""; // 下記で作成済みのformへ追加するスタイル。
    while( 0 < i-- ){
        str += "<div><input type=\"radio\" name=\"candidate\" value=\"" + candidate.item(i).transcript + "\">";
        str += candidate.item(i).transcript;
        str += "</input></div>";
    }
    this.itsNoticeOverlayDiv.find("form").eq(0).append( str );

    this.itsNoticeOverlayDiv.find( "form div" ).each( function(){
        $(this).click( function(){
            dfd_notice.resolve( $(this).find("input").eq(0).val() );
        });
    });
    this.itsNoticeOverlayDiv.find( "form input[type='button']" ).each( function(){
        // 動作を変更する（stop()処理が不要になる。また投げる先のdfdが異なる）。
        $(this).click( function(){
            dfd_notice.reject( null );
        });
    });

    // 戻り値なし。
};
SpeechInputWs.prototype.start = function() {
    var self = this;
    var dfd_sound = new $.Deferred();
    var str = "　<form>音声入力中・・・ &nbsp; <br><br><input id=\"suspend\" type=\"button\" value=\"中止\"></input><br>";
    str += "</form>";

    // 音声入力の受付を開始
    this.itsRecognition.start();

    // ユーザー通知系の処理
    this.itsNoticeOverlayDiv.empty();
    this.itsNoticeOverlayDiv.append( str );
    this.itsNoticeOverlayDiv.show();
    this.itsNoticeOverlayDiv.find("form input[type='button']").each( function(){
        $(this).click( function(){
            self.itsRecognition.stop();
            self.itsNoticeOverlayDiv.hide();
            dfd_sound.reject( null );
        });
    });

    // 録音終了時トリガーを受けるDeferredを設定
    this.itsLastDfd = new $.Deferred();
    this.itsLastDfd.done( function( text ){
        dfd_sound.resolve( text );
    }).fail( function(){
        dfd_sound.reject( null );
    }).always( function(){
        self.itsNoticeOverlayDiv.hide();
    });

    return dfd_sound.promise();
};
