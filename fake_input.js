//
//    Fake Input
//
//The below JavaScript lines can be used to simulate live stream events.
//


//  Cheer  //

handle_irc_message({
	data: "@badges=broadcaster/1;bits=500;color=#1E90FF;display-name=Lazy_Luc;emotes=;id=31e2d815-db04-4b4a-bfce-058f8fc0a637;mod=0;room-id=84219088;subscriber=0;tmi-sent-ts=1533617048547;turbo=0;user-id=84219088;user-type= :lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv PRIVMSG #jerma985 :oh no, does this work?"
});

//Cheer with a lot of BTTV emotes.
handle_irc_message({
	data: "@badges=broadcaster/1;bits=5000;color=#1E90FF;display-name=Lazy_Luc;emotes=;id=31e2d815-db04-4b4a-bfce-058f8fc0a637;mod=0;room-id=84219088;subscriber=0;tmi-sent-ts=1533617048547;turbo=0;user-id=84219088;user-type= :lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv PRIVMSG #jerma985 :oh PedoBear RebeccaBlack :tf: CiGrip DatSauce ForeverAlone GabeN HailHelix HerbPerve iDog rStrike ShoopDaWhoop SwedSwag M&Mjc bttvNice TopHam TwaT WatChuSay SavageJerky Zappa tehPoleCat AngelThump HHydro TaxiBro BroBalt ButterSauce BaconEffect SuchFraud CandianRage She'llBeRight D: VisLaud KaRappa YetiZ miniJulia FishMoley Hhhehehe KKona PoleDoge sosGame CruW RarePepe iamsocal haHAA FeelsBirthdayMan RonSmug KappaCool FeelsBadMan BasedGod bUrself ConcernDoge FeelsGoodMan FireSpeed NaM SourPls LuL SaltyCorn FCreep monkaS VapeNation ariW notsquishY FeelsAmazingMan DuckerZ SqShy Wowee WubTF cvR cvL cvHazmat cvMask PepoDance OMEGALUL PepeHands (ditto) Clap pepeD pepeLaugh HYPERS peepoHappy jermaGrin jermaSheeto YOUDIED jermaSuperFrog jermaVroom2 jermaWalk jermaOtto hehe"
});

//Cheer with a lot of FFZ emotes.
handle_irc_message({
	data: "@badges=broadcaster/1;bits=5000;color=#1E90FF;display-name=Lazy_Luc;emotes=;id=31e2d815-db04-4b4a-bfce-058f8fc0a637;mod=0;room-id=84219088;subscriber=0;tmi-sent-ts=1533617048547;turbo=0;user-id=84219088;user-type= :lazy_luc!lazy_luc@lazy_luc.tmi.twitch.tv PRIVMSG #jerma985 :cheer5000 oh ZrehplaR YooHoo YellowFever ManChicken BeanieHipster CatBag ZreknarF LilZ ZliL LaterSooner BORT hehe"
});

//  Subscription  //

handle_irc_message({
	data: "@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-cumulative-months=6;msg-param-streak-months=2;msg-param-should-share-streak=1;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\shas\ssubscribed\sfor\s6\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :Great stream -- keep it up!"
});

//  Subgift  //

handle_irc_message({
	data: "@badges=broadcaster/1,subscriber/6;color=;display-name=qa_subs_partner;emotes=;flags=;id=b1818e3c-0005-490f-ad0a-804957ddd760;login=qa_subs_partner;mod=0;msg-id=subgift;msg-param-months=3;msg-param-recipient-display-name=TenureCalculator;msg-param-recipient-id=135054130;msg-param-recipient-user-name=tenurecalculator;msg-param-sub-plan-name=t111;msg-param-sub-plan=1000;room-id=196450059;subscriber=1;system-msg=An\sanonymous\suser\sgifted\sa\sTier\s1\ssub\sto\sTenureCalculator!\s;tmi-sent-ts=1542063432068;turbo=0;user-id=196450059;user-type= :tmi.twitch.tv USERNOTICE #qa_subs_partner"
});

//3 Subgifts for a specific person.
handle_irc_message({
	data: "@badge-info=;badges=;color=#1E90FF;display-name=A_Lazy_Bot;emotes=;flags=;id=eb0a7938-fa16-4a12-a5ce-c5858ffccddd;login=a_lazy_bot;mod=0;msg-id=subgift;msg-param-gift-months=3;msg-param-months=23;msg-param-origin-id=da\s39\sa3\see\s5e\s6b\s4b\s0d\s32\s55\sbf\sef\s95\s60\s18\s90\saf\sd8\s07\s09;msg-param-recipient-display-name=Lazy_Luc;msg-param-recipient-id=84219088;msg-param-recipient-user-name=lazy_luc;msg-param-sender-count=4;msg-param-sub-plan-name=Channel\sSubscription\s(jerma985);msg-param-sub-plan=1000;room-id=23936415;subscriber=0;system-msg=A_Lazy_Bot\sgifted\s3\smonths\sof\sTier\s1\sto\sLazy_Luc.\sThey've\sgifted\s4\smonths\sin\sthe\schannel!;tmi-sent-ts=1594317548481;user-id=246657382;user-type= :tmi.twitch.tv USERNOTICE #jerma985"
});

//Anon
handle_irc_message({
	data: "@badges=broadcaster/1,subscriber/6;color=;display-name=qa_subs_partner;emotes=;flags=;id=b1818e3c-0005-490f-ad0a-804957ddd760;login=qa_subs_partner;mod=0;msg-id=anonsubgift;msg-param-months=3;msg-param-recipient-display-name=TenureCalculator;msg-param-recipient-id=135054130;msg-param-recipient-user-name=tenurecalculator;msg-param-sub-plan-name=t111;msg-param-sub-plan=1000;room-id=196450059;subscriber=1;system-msg=An\sanonymous\suser\sgifted\sa\sTier\s1\ssub\sto\sTenureCalculator!\s;tmi-sent-ts=1542063432068;turbo=0;user-id=196450059;user-type= :tmi.twitch.tv USERNOTICE #qa_subs_partner"
});

//  Communitygift  //

handle_irc_message({
	data: "@badges=subscriber/12,bits/1000;color=#FF7F50;display-name=AtmaStarfish;emotes=;id=8be40fa1-60ad-4e1c-b354-83ff5c3e7c3f;login=atmastarfish;mod=0;msg-id=submysterygift;msg-param-mass-gift-count=5;msg-param-sender-count=10;msg-param-sub-plan=1000;room-id=23936415;subscriber=1;system-msg=AtmaStarfish\\sis\\sgifting\\s5\\sTier\\s1\\sSubs\\sto\\sJerma985's\\scommunity!\\sThey've\\sgifted\\sa\\stotal\\sof\\s10\\sin\\sthe\\schannel!;tmi-sent-ts=1535081561931;turbo=0;user-id=49400473;user-type= :tmi.twitch.tv USERNOTICE #jerma985"
});

//Anon
handle_irc_message({
	data: "@badges=subscriber/12,bits/1000;color=#FF7F50;display-name=AtmaStarfish;emotes=;id=8be40fa1-60ad-4e1c-b354-83ff5c3e7c3f;login=atmastarfish;mod=0;msg-id=anonsubmysterygift;msg-param-mass-gift-count=5;msg-param-sender-count=10;msg-param-sub-plan=1000;room-id=23936415;subscriber=1;system-msg=AtmaStarfish\\sis\\sgifting\\s5\\sTier\\s1\\sSubs\\sto\\sJerma985's\\scommunity!\\sThey've\\sgifted\\sa\\stotal\\sof\\s10\\sin\\sthe\\schannel!;tmi-sent-ts=1535081561931;turbo=0;user-id=49400473;user-type= :tmi.twitch.tv USERNOTICE #jerma985"
});

//  Raid  //

handle_irc_message({
	data: "@badges=turbo/1;color=#9ACD32;display-name=TestChannel;emotes=;id=3d830f12-795c-447d-af3c-ea05e40fbddb;login=testchannel;mod=0;msg-id=raid;msg-param-displayName=TestChannel;msg-param-login=testchannel;msg-param-viewerCount=15;room-id=56379257;subscriber=0;system-msg=15\sraiders\sfrom\sTestChannel\shave\sjoined\n!;tmi-sent-ts=1507246572675;turbo=1;user-id=123456;user-type= :tmi.twitch.tv USERNOTICE #othertestchannel"
});
