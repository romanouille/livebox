<!-- vim: set fileencoding=utf-8 : -->
<div id="logoOrange">
  <img id="logo"/>
</div>
<div id="LangOption">
  <div id="Select-Lang">
    <div id="Language">
      <div class="label" xmsg="GUI_HEADER_LANGUAGE_LABEL" />
    </div>
  </div>
</div>

<script type="text/javascript">
  jQuery(function ($) {
      var gui = $.gui, target = gui.currentTarget;
      $("#logo").attr("src", "img/orange_logo_rgb.jpg");
      var langSelect = $("#Language");
      var languages = [];
      $.each(gui.languages, function (i) {
        languages.push({
              value: this.lang,
              text: this.name
            });
      });
      langSelect.guiList({ connected: false, options: languages, defValue: gui.language.lang }).change(function () {
        gui.setLanguage(langSelect.guiItem("value"));
      });
  });

</script>
