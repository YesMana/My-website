using System;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using System.Net.Http;
using System.Threading.Tasks;

namespace SinhalaTool
{
    public partial class Form1 : Form
    {
        private TextBox txtSinglish;
        private TextBox txtSinhala;
        private TextBox txtTrans;
        private ComboBox cmbLang;
        private Button btnCopy;
        private Button btnCopyTrans;
        private Button btnClear;
        private Label lblDrag;
        private Label lblClose;
        private Label lblInfo;
        private System.Windows.Forms.Timer transTimer;

        public Form1()
        {
            InitializeComponent();
            transTimer = new System.Windows.Forms.Timer();
            transTimer.Interval = 600;
            transTimer.Tick += TransTimer_Tick;
        }

        private void InitializeComponent()
        {
            this.txtSinglish = new System.Windows.Forms.TextBox();
            this.txtSinhala = new System.Windows.Forms.TextBox();
            this.txtTrans = new System.Windows.Forms.TextBox();
            this.cmbLang = new System.Windows.Forms.ComboBox();
            this.btnCopy = new System.Windows.Forms.Button();
            this.btnCopyTrans = new System.Windows.Forms.Button();
            this.btnClear = new System.Windows.Forms.Button();
            this.lblDrag = new System.Windows.Forms.Label();
            this.lblClose = new System.Windows.Forms.Label();
            this.lblInfo = new System.Windows.Forms.Label();
            
            // Form1
            this.ClientSize = new System.Drawing.Size(450, 130);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.BackColor = System.Drawing.Color.FromArgb(24, 24, 24);
            this.TopMost = true;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Text = "Sinhala Tool";

            // lblDrag
            this.lblDrag.Text = "|||";
            this.lblDrag.ForeColor = System.Drawing.Color.DimGray;
            this.lblDrag.Location = new System.Drawing.Point(5, 55);
            this.lblDrag.Size = new System.Drawing.Size(20, 20);
            this.lblDrag.Cursor = Cursors.SizeAll;
            this.lblDrag.MouseDown += LblDrag_MouseDown;

            // txtSinglish
            this.txtSinglish.Location = new System.Drawing.Point(30, 15);
            this.txtSinglish.Size = new System.Drawing.Size(320, 25);
            this.txtSinglish.BackColor = System.Drawing.Color.FromArgb(17, 17, 17);
            this.txtSinglish.ForeColor = System.Drawing.Color.Cyan;
            this.txtSinglish.BorderStyle = BorderStyle.FixedSingle;
            this.txtSinglish.Font = new System.Drawing.Font("Segoe UI", 11F);
            this.txtSinglish.TextChanged += TxtSinglish_TextChanged;

            // btnClear
            this.btnClear.Location = new System.Drawing.Point(360, 15);
            this.btnClear.Size = new System.Drawing.Size(50, 25);
            this.btnClear.Text = "Clear";
            this.btnClear.BackColor = System.Drawing.Color.FromArgb(64, 64, 64);
            this.btnClear.ForeColor = System.Drawing.Color.White;
            this.btnClear.FlatStyle = FlatStyle.Flat;
            this.btnClear.FlatAppearance.BorderSize = 0;
            this.btnClear.Cursor = Cursors.Hand;
            this.btnClear.Click += BtnClear_Click;

            // lblClose
            this.lblClose.Text = "X";
            this.lblClose.ForeColor = System.Drawing.Color.IndianRed;
            this.lblClose.Location = new System.Drawing.Point(420, 18);
            this.lblClose.Size = new System.Drawing.Size(20, 20);
            this.lblClose.Cursor = Cursors.Hand;
            this.lblClose.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.lblClose.Click += (s, e) => this.Close();

            // txtSinhala
            this.txtSinhala.Location = new System.Drawing.Point(30, 45);
            this.txtSinhala.Size = new System.Drawing.Size(320, 25);
            this.txtSinhala.BackColor = System.Drawing.Color.FromArgb(17, 17, 17);
            this.txtSinhala.ForeColor = System.Drawing.Color.White;
            this.txtSinhala.BorderStyle = BorderStyle.FixedSingle;
            this.txtSinhala.ReadOnly = true;
            this.txtSinhala.Font = new System.Drawing.Font("Segoe UI", 12F);

            // btnCopy
            this.btnCopy.Location = new System.Drawing.Point(360, 45);
            this.btnCopy.Size = new System.Drawing.Size(80, 25);
            this.btnCopy.Text = "Copy";
            this.btnCopy.BackColor = System.Drawing.Color.DarkCyan;
            this.btnCopy.ForeColor = System.Drawing.Color.White;
            this.btnCopy.FlatStyle = FlatStyle.Flat;
            this.btnCopy.FlatAppearance.BorderSize = 0;
            this.btnCopy.Cursor = Cursors.Hand;
            this.btnCopy.Click += (s,e) => CopyToClip(txtSinhala, btnCopy);

            // cmbLang
            this.cmbLang.Location = new System.Drawing.Point(30, 75);
            this.cmbLang.Size = new System.Drawing.Size(95, 25);
            this.cmbLang.DropDownStyle = ComboBoxStyle.DropDownList;
            this.cmbLang.BackColor = System.Drawing.Color.FromArgb(17, 17, 17);
            this.cmbLang.ForeColor = System.Drawing.Color.Cyan;
            this.cmbLang.FlatStyle = FlatStyle.Flat;
            
            var langs = new System.Collections.Generic.Dictionary<string, string>() {
                {"af", "Afrikaans"}, {"sq", "Albanian"}, {"am", "Amharic"}, {"ar", "Arabic"}, {"hy", "Armenian"}, 
                {"az", "Azerbaijani"}, {"eu", "Basque"}, {"be", "Belarusian"}, {"bn", "Bengali"}, {"bs", "Bosnian"}, 
                {"bg", "Bulgarian"}, {"ca", "Catalan"}, {"ceb", "Cebuano"}, {"ny", "Chichewa"}, {"zh-CN", "Chinese (S)"}, 
                {"zh-TW", "Chinese (T)"}, {"co", "Corsican"}, {"hr", "Croatian"}, {"cs", "Czech"}, {"da", "Danish"}, 
                {"nl", "Dutch"}, {"en", "English"}, {"eo", "Esperanto"}, {"et", "Estonian"}, {"tl", "Filipino"}, 
                {"fi", "Finnish"}, {"fr", "French"}, {"fy", "Frisian"}, {"gl", "Galician"}, {"ka", "Georgian"}, 
                {"de", "German"}, {"el", "Greek"}, {"gu", "Gujarati"}, {"ht", "Haitian Creole"}, {"ha", "Hausa"}, 
                {"haw", "Hawaiian"}, {"iw", "Hebrew"}, {"hi", "Hindi"}, {"hmn", "Hmong"}, {"hu", "Hungarian"}, 
                {"is", "Icelandic"}, {"ig", "Igbo"}, {"id", "Indonesian"}, {"ga", "Irish"}, {"it", "Italian"}, 
                {"ja", "Japanese"}, {"jw", "Javanese"}, {"kn", "Kannada"}, {"kk", "Kazakh"}, {"km", "Khmer"}, 
                {"ko", "Korean"}, {"ku", "Kurdish"}, {"ky", "Kyrgyz"}, {"lo", "Lao"}, {"la", "Latin"}, 
                {"lv", "Latvian"}, {"lt", "Lithuanian"}, {"lb", "Luxembourgish"}, {"mk", "Macedonian"}, {"mg", "Malagasy"}, 
                {"ms", "Malay"}, {"ml", "Malayalam"}, {"mt", "Maltese"}, {"mi", "Maori"}, {"mr", "Marathi"}, 
                {"mn", "Mongolian"}, {"my", "Myanmar"}, {"ne", "Nepali"}, {"no", "Norwegian"}, {"ps", "Pashto"}, 
                {"fa", "Persian"}, {"pl", "Polish"}, {"pt", "Portuguese"}, {"pa", "Punjabi"}, {"ro", "Romanian"}, 
                {"ru", "Russian"}, {"sm", "Samoan"}, {"gd", "Scots Gaelic"}, {"sr", "Serbian"}, {"st", "Sesotho"}, 
                {"sn", "Shona"}, {"sd", "Sindhi"}, {"sk", "Slovak"}, {"sl", "Slovenian"}, {"so", "Somali"}, 
                {"es", "Spanish"}, {"su", "Sundanese"}, {"sw", "Swahili"}, {"sv", "Swedish"}, {"tg", "Tajik"}, 
                {"ta", "Tamil"}, {"te", "Telugu"}, {"th", "Thai"}, {"tr", "Turkish"}, {"uk", "Ukrainian"}, 
                {"ur", "Urdu"}, {"uz", "Uzbek"}, {"vi", "Vietnamese"}, {"cy", "Welsh"}, {"xh", "Xhosa"}, 
                {"yi", "Yiddish"}, {"yo", "Yoruba"}, {"zu", "Zulu"}
            };
            this.cmbLang.DataSource = new BindingSource(langs, null);
            this.cmbLang.DisplayMember = "Value";
            this.cmbLang.ValueMember = "Key";
            this.cmbLang.SelectedValue = "en";
            this.cmbLang.SelectedIndexChanged += (s, e) => { TranslateOnline(); };

            // txtTrans
            this.txtTrans.Location = new System.Drawing.Point(130, 75);
            this.txtTrans.Size = new System.Drawing.Size(220, 25);
            this.txtTrans.BackColor = System.Drawing.Color.FromArgb(17, 17, 17);
            this.txtTrans.ForeColor = System.Drawing.Color.SpringGreen;
            this.txtTrans.BorderStyle = BorderStyle.FixedSingle;
            this.txtTrans.ReadOnly = true;
            this.txtTrans.Font = new System.Drawing.Font("Segoe UI", 11F);

            // btnCopyTrans
            this.btnCopyTrans.Location = new System.Drawing.Point(360, 75);
            this.btnCopyTrans.Size = new System.Drawing.Size(80, 25);
            this.btnCopyTrans.Text = "Copy";
            this.btnCopyTrans.BackColor = System.Drawing.Color.DarkGreen;
            this.btnCopyTrans.ForeColor = System.Drawing.Color.White;
            this.btnCopyTrans.FlatStyle = FlatStyle.Flat;
            this.btnCopyTrans.FlatAppearance.BorderSize = 0;
            this.btnCopyTrans.Cursor = Cursors.Hand;
            this.btnCopyTrans.Click += (s,e) => CopyToClip(txtTrans, btnCopyTrans);

            // lblInfo
            this.lblInfo.Text = "* Translation requires an active internet connection.";
            this.lblInfo.ForeColor = System.Drawing.Color.Gray;
            this.lblInfo.Location = new System.Drawing.Point(30, 105);
            this.lblInfo.Size = new System.Drawing.Size(400, 20);
            this.lblInfo.Font = new System.Drawing.Font("Segoe UI", 8F);

            this.Controls.Add(this.lblDrag);
            this.Controls.Add(this.txtSinglish);
            this.Controls.Add(this.btnClear);
            this.Controls.Add(this.lblClose);
            this.Controls.Add(this.txtSinhala);
            this.Controls.Add(this.btnCopy);
            this.Controls.Add(this.cmbLang);
            this.Controls.Add(this.txtTrans);
            this.Controls.Add(this.btnCopyTrans);
            this.Controls.Add(this.lblInfo);
            
            this.MouseDown += LblDrag_MouseDown;
        }

        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern bool ReleaseCapture();

        private void LblDrag_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }

        private void CopyToClip(TextBox t, Button b)
        {
            if (!string.IsNullOrEmpty(t.Text) && !t.Text.Contains("Translating"))
            {
                Clipboard.SetText(t.Text);
                b.Text = "Copied!";
                System.Windows.Forms.Timer tm = new System.Windows.Forms.Timer();
                tm.Interval = 1000;
                tm.Tick += (s, ev) => { b.Text = "Copy"; tm.Stop(); };
                tm.Start();
            }
        }

        private void BtnClear_Click(object sender, EventArgs e)
        {
            txtSinglish.Text = "";
            txtSinhala.Text = "";
            txtTrans.Text = "";
            txtSinglish.Focus();
        }

        private void TxtSinglish_TextChanged(object sender, EventArgs e)
        {
            txtSinhala.Text = ConvertToSinhala(txtSinglish.Text);
            transTimer.Stop();
            transTimer.Start();
        }

        private void TransTimer_Tick(object? sender, EventArgs e)
        {
            transTimer.Stop();
            TranslateOnline();
        }

        private async void TranslateOnline()
        {
            if (string.IsNullOrWhiteSpace(txtSinhala.Text)) { txtTrans.Text = ""; return; }
            txtTrans.Text = "Translating...";
            try
            {
                string targetLang = cmbLang.SelectedValue?.ToString() ?? "en";
                string url = $"https://translate.googleapis.com/translate_a/single?client=gtx&sl=si&tl={targetLang}&dt=t&q={Uri.EscapeDataString(txtSinhala.Text)}";
                using (var client = new HttpClient())
                {
                    string result = await client.GetStringAsync(url);
                    var match = Regex.Match(result, @"\[\[\[""(.*?)""");
                    if (match.Success)
                    {
                        txtTrans.Text = match.Groups[1].Value.Replace("\\\"", "\"").Replace("\\n", "\n").Replace("\\r", "\r");
                    }
                }
            }
            catch
            {
                txtTrans.Text = "Translation Error! Check Internet.";
            }
        }

        private string ConvertToSinhala(string text)
        {
            if (string.IsNullOrEmpty(text)) return "";

            string[] vowelsUni = new string[26];
            string[] vowels = new string[26];
            string[] vowelModifiersUni = new string[26];
            string[] specialConsonantsUni = new string[5];
            string[] specialConsonants = new string[5];
            string[] consonantsUni = new string[48];
            string[] consonants = new string[48];

            vowelsUni[0]="ඌ"; vowels[0]="oo"; vowelsUni[1]="ඕ"; vowels[1]="o\\)"; vowelsUni[2]="ඕ"; vowels[2]="oe";
            vowelsUni[3]="ආ"; vowels[3]="aa"; vowelsUni[4]="ආ"; vowels[4]="a\\)"; vowelsUni[5]="ඈ"; vowels[5]="Aaa";
            vowelsUni[6]="ඈ"; vowels[6]="A\\)"; vowelsUni[7]="ඈ"; vowels[7]="ae"; vowelsUni[8]="ඊ"; vowels[8]="ii";
            vowelsUni[9]="ඊ"; vowels[9]="i\\)"; vowelsUni[10]="ඊ"; vowels[10]="ie"; vowelsUni[11]="ඊ"; vowels[11]="ee";
            vowelsUni[12]="ඒ"; vowels[12]="ea"; vowelsUni[13]="ඒ"; vowels[13]="e\\)"; vowelsUni[14]="ඒ"; vowels[14]="ei";
            vowelsUni[15]="ඌ"; vowels[15]="uu"; vowelsUni[16]="ඌ"; vowels[16]="u\\)"; vowelsUni[17]="ඖ"; vowels[17]="au";
            vowelsUni[18]="ඇ"; vowels[18]="/\\a"; vowelsUni[19]="අ"; vowels[19]="a"; vowelsUni[20]="ඇ"; vowels[20]="A";
            vowelsUni[21]="ඉ"; vowels[21]="i"; vowelsUni[22]="එ"; vowels[22]="e"; vowelsUni[23]="උ"; vowels[23]="u";
            vowelsUni[24]="ඔ"; vowels[24]="o"; vowelsUni[25]="ඓ"; vowels[25]="I";

            vowelModifiersUni[0]="ූ"; vowelModifiersUni[1]="ෝ"; vowelModifiersUni[2]="ෝ"; vowelModifiersUni[3]="ා";
            vowelModifiersUni[4]="ා"; vowelModifiersUni[5]="ෑ"; vowelModifiersUni[6]="ෑ"; vowelModifiersUni[7]="ෑ";
            vowelModifiersUni[8]="ී"; vowelModifiersUni[9]="ී"; vowelModifiersUni[10]="ී"; vowelModifiersUni[11]="ී";
            vowelModifiersUni[12]="ේ"; vowelModifiersUni[13]="ේ"; vowelModifiersUni[14]="ේ"; vowelModifiersUni[15]="ූ";
            vowelModifiersUni[16]="ූ"; vowelModifiersUni[17]="ෞ"; vowelModifiersUni[18]="ැ"; vowelModifiersUni[19]="";
            vowelModifiersUni[20]="ැ"; vowelModifiersUni[21]="ි"; vowelModifiersUni[22]="ෙ"; vowelModifiersUni[23]="ු";
            vowelModifiersUni[24]="ො"; vowelModifiersUni[25]="ෛ";

            specialConsonantsUni[0]="ං"; specialConsonants[0]="\\\\n"; specialConsonantsUni[1]="ඃ"; specialConsonants[1]="\\\\h";
            specialConsonantsUni[2]="ඞ"; specialConsonants[2]="\\\\N"; specialConsonantsUni[3]="ඍ"; specialConsonants[3]="\\\\R";
            specialConsonantsUni[4]="ඎ"; specialConsonants[4]="R\\\\|";

            consonantsUni[0]="ඬ"; consonants[0]="nnd"; consonantsUni[1]="ඳ"; consonants[1]="nndh";
            consonantsUni[2]="ඟ"; consonants[2]="nng"; consonantsUni[3]="ථ"; consonants[3]="Th";
            consonantsUni[4]="ධ"; consonants[4]="Dh"; consonantsUni[5]="ඝ"; consonants[5]="gh";
            consonantsUni[6]="ඡ"; consonants[6]="Ch"; consonantsUni[7]="ඵ"; consonants[7]="ph";
            consonantsUni[8]="භ"; consonants[8]="bh"; consonantsUni[9]="ශ"; consonants[9]="sh";
            consonantsUni[10]="ෂ"; consonants[10]="Sh"; consonantsUni[11]="ඥ"; consonants[11]="GN";
            consonantsUni[12]="ඤ"; consonants[12]="KN"; consonantsUni[13]="ළු"; consonants[13]="Lu";
            consonantsUni[14]="ද"; consonants[14]="dh"; consonantsUni[15]="ච"; consonants[15]="ch";
            consonantsUni[16]="ඛ"; consonants[16]="kh"; consonantsUni[17]="ත"; consonants[17]="th";
            consonantsUni[18]="ට"; consonants[18]="t"; consonantsUni[19]="ක"; consonants[19]="k";
            consonantsUni[20]="ඩ"; consonants[20]="d"; consonantsUni[21]="න"; consonants[21]="n";
            consonantsUni[22]="ප"; consonants[22]="p"; consonantsUni[23]="බ"; consonants[23]="b";
            consonantsUni[24]="ම"; consonants[24]="m"; consonantsUni[25]="‍ය"; consonants[25]="\\\\u005C" + "y";
            consonantsUni[26]="‍ය"; consonants[26]="Y"; consonantsUni[27]="ය"; consonants[27]="y";
            consonantsUni[28]="ජ"; consonants[28]="j"; consonantsUni[29]="ල"; consonants[29]="l";
            consonantsUni[30]="ව"; consonants[30]="v"; consonantsUni[31]="ව"; consonants[31]="w";
            consonantsUni[32]="ස"; consonants[32]="s"; consonantsUni[33]="හ"; consonants[33]="h";
            consonantsUni[34]="ණ"; consonants[34]="N"; consonantsUni[35]="ළ"; consonants[35]="L";
            consonantsUni[36]="ඛ"; consonants[36]="K"; consonantsUni[37]="ඝ"; consonants[37]="G";
            consonantsUni[38]="ඨ"; consonants[38]="T"; consonantsUni[39]="ඪ"; consonants[39]="D";
            consonantsUni[40]="ඵ"; consonants[40]="P"; consonantsUni[41]="භ"; consonants[41]="B";
            consonantsUni[42]="ශ"; consonants[42]="S"; consonantsUni[43]="ෂ"; consonants[43]="sh";
            consonantsUni[44]="ළ"; consonants[44]="L"; consonantsUni[45]="ච"; consonants[45]="c";
            consonantsUni[46]="ග"; consonants[46]="g"; consonantsUni[47]="ර"; consonants[47]="r";

            for (int i=0; i<specialConsonants.Length; i++) text = Regex.Replace(text, specialConsonants[i], specialConsonantsUni[i]);
            
            for (int i=0; i<consonants.Length; i++){
                for (int j=0; j<26; j++){ 
                    string s = consonants[i] + "r" + vowels[j]; 
                    string v = consonantsUni[i] + "්‍ර" + vowelModifiersUni[j];
                    text = Regex.Replace(text, s, v);
                    
                    s = consonants[i] + vowels[j]; 
                    v = consonantsUni[i] + vowelModifiersUni[j];
                    text = Regex.Replace(text, s, v);
                }
            }
            for (int i=0; i<consonants.Length; i++){
                text = Regex.Replace(text, consonants[i], consonantsUni[i]+"්");
            }
            for (int i=0; i<26; i++){
                text = Regex.Replace(text, vowels[i], vowelsUni[i]);
            }
            return text;
        }
    }
}
