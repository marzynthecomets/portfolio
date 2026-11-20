// “When #RSV Goes Viral: Designing TikTok to Fight Infodemics” — seminar paper,
// INFO-601-09, December 15, 2025. Text from Mars’s PDF.
export const RSV = {
 "blocks": [
  {
   "t": "h2",
   "x": "Abstract"
  },
  {
   "t": "p",
   "x": "This paper examines the information ecosystem of TikTok, how infrastructure choices in algorithms, content moderation, and product design all play a role in how users, including young parents looking for information about respiratory syncytial virus (RSV) find information about immunizations and vaccinations, are exposed to and navigate misinformation, and offers supplemental design interventions to improve public health outcomes."
  },
  {
   "t": "h2",
   "x": "Introduction"
  },
  {
   "t": "p",
   "x": "With new social media platforms and changing information ecosystems come new health information-seeking challenges for young parents looking for guidance on key health issues like respiratory syncytial virus (RSV), the leading cause of hospitalizations in babies (American Lung Association. Accessed November 13, 2025)."
  },
  {
   "t": "p",
   "x": "RSV is a virus that infects the respiratory system, including the nose, throat, and lungs (Centers for Disease Control and Prevention, About RSV. 2025). While a very common virus, RSV can be especially dangerous in the elderly and infants. Severe RSV lung infections can lead to bronchiolitis and pneumonia, and are the leading cause of hospitalizations in babies (American Lung Association)."
  },
  {
   "t": "p",
   "x": "Current immunization options for babies include a maternal vaccine Abrysvo (RSVpreF), and monoclonal antibody immunizations clesrovimab, nirsevimab, and palivizumab (American Academy of Pediatrics, 2025). These immunizations can help reduce the likelihood of serious illness and hospitalizations. Therefore, it’s important to help parents make educated decisions about whether to immunize or not. Reducing infant hospitalization can also help alleviate the burden on the healthcare system. Misinformation about immunizations, however, can lead to the preventable spread of disease and tragedy for families."
  },
  {
   "t": "p",
   "x": "Parents have had to contend with health misinformation for years, from misinformation about vaccines causing autism, to fears stoked about the MMR (measles, mumps, rubella) vaccine and the HPV vaccine (OSG, 2021). However, health misinformation has been around for much of human history, exacerbating the spread of disease and fear around it, from the 1918 Spanish flu to cholera to the HIV/AIDS epidemic in the 1980s (Tomes and Parry 2022)."
  },
  {
   "t": "p",
   "x": "On a global level, and more recently, the COVID-19 global pandemic has resulted in a wealth of research on the consequences of disease and misinformation. Around 88% of the misinformation about COVID-19 that was examined by fact-checking publications in 2020 was found to have appeared on social media, contributing to vaccine hesitancy and disease spread (Brennen et al., 2020). At the same time during the pandemic, TikTok, a short-form video-based social media platform, saw its popularity increase by 38%, outstripping other platforms during the period (Dixon, 2023). Today, the hashtag #covid has 5.5 million posts on TikTok (TikTok, #covid, accessed December 2025)."
  },
  {
   "t": "p",
   "x": "Today, about a third of US adults use TikTok, primarily for entertainment, but also to stay informed, with the number of users who get news on the app doubling since 2020 (Eddy, 2024). These users are mostly young, with 59% of Americans between the ages of 19-29 and 40% for Americans between 30-49 (Eddy, 2024). The average age of Americans for giving birth is around 27.5 years old, but ranges by state, with states like Mississippi, Arkansas, and Oklahoma having an average age of 24-25 (Fitzpatrick, 2025). This demographic information indicates that many users who adopted the platform during the pandemic could now make up a significant part of the current generation of young parents. Parent-related hashtags on TikTok also reflect this growth, #parentsoftiktok with 2.6M posts, #parenting with 4M posts, and #momtok with 9.6M posts (TikTok)."
  },
  {
   "t": "p",
   "x": "Much of the platform’s success has been attributed to its powerful algorithm, which “exploits users’ interests in between 30% and 50% of all recommended videos,” detecting what users like to build a “personalization score” and feed them more and more of what they like (Vombatkere et al. 2024). Due to this personalization, users can become “‘addicted’ in under 35 minutes, or 260 videos” (Allyn et al. 2024). Content can go viral quickly, accumulating millions of views in short amounts of time. However, this also means that misinformation, including health misinformation, can also reach millions of users quickly, before content moderation can catch up."
  },
  {
   "t": "p",
   "x": "Such a platform has a significant influence on the beliefs, behaviors, and health of its millions of users. Therefore, when designing such a product and making infrastructure choices, it becomes imperative not just to design the platform to maximize business key performance indicators like user retention, engagement, and advertising interaction metrics, but also to maximize the health and well-being of its users and their communities, both on and off the platform, by reducing their exposure to health misinformation and assisting them in finding helpful, credible health information so they can make the best choices for themselves and their children. This paper seeks to survey the current health information and misinformation landscape on TikTok, especially in the area of RSV information, in order to analyze, critique, and offer remedy where possible."
  },
  {
   "t": "note",
   "x": "Disclosure: I currently work for an advertising agency promoting awareness of RSV and a monoclonal antibody immunization against RSV."
  },
  {
   "t": "h2",
   "x": "Literature Review"
  },
  {
   "t": "h3",
   "x": "Misinformation on TikTok and Infodemics"
  },
  {
   "t": "p",
   "x": "With around 16,000 videos uploaded to TikTok every minute (Statista, 2024) it’s not surprising that some of the information shared in videos is false, whether it was the posters’ intention to mislead or not. Researchers Claire Wardle and Hossein Derakhshan created a framework to illustrate the difference between misinformation, malinformation, and disinformation (Wardle and Derakhshan, 2017)."
  },
  {
   "t": "list",
   "items": [
    "Mis-information: “false information is shared, but no harm is meant.”",
    "Dis-information: “false information is knowingly shared to cause harm.”",
    "Mal-information: “genuine information is shared to cause harm[...]”"
   ]
  },
  {
   "t": "p",
   "x": "While this distinction is important in information research, it’s difficult to ascertain the intentions of any one user in the absence of publicly available evidence. For this paper, we’ll be using “misinformation” as an umbrella term encompassing all of the above. Even without the intent to mislead, misinformation can still cause harm by leading parents to make ill-informed health choices for their children."
  },
  {
   "t": "p",
   "x": "Misinformation online can affect perceptions of safety, effectiveness, and side effects, contributing to parents’ vaccine hesitancy, or “the rejection or delay to get vaccinated even if there is an effective vaccine available” (Garett and Young, 2021). This hesitancy results in outbreaks of diseases like measles, chickenpox, HPV, and more that could otherwise have been prevented with vaccines (Cagnotta et al, 2025). In South Carolina, an outbreak of measles that began in October of 2025 has led to over 100 people being sickened and over 200 exposed and quarantined. This has been attributed to the local school district of Spartanburg only reaching 90% childhood immunization coverage, “below the 95 percent target that experts consider necessary to stem the spread of measles” (Rosenbluth, 2025)."
  },
  {
   "t": "p",
   "x": "Health misinformation can not only affect individual parents’ health choices but can also exacerbate country-wide and global health crises. The WHO has classified misinformation as a public health risk and crisis in its own right, calling it an “infodemic,” defined as “too much information, including false or misleading information, in digital and physical environments during a disease outbreak” (WHO, accessed November 2025). The most prominent example of this to date has been the COVID-19 infodemic. As mentioned before, 88% of the fact-checked misinformation about COVID-19 in 2020 was found to have appeared on social media (Brennen et. al, 2020). A year later, in 2021, the WHO conducted a systematic review of the literature on misinformation about COVID-19 and found that between 0.2% and 28.8% of posts on social media platforms contained misinformation (Gabarron, Oyeyemi, and Wynn, 2021)."
  },
  {
   "t": "p",
   "x": "However, it is unclear if observations and findings on such a politicized and global health phenomenon can be extrapolated to more local and less politicized health issues. RSV is significantly less well-known than COVID-19. #RSV on TikTok has only 100.4K posts compared to the 5.5 million on #Covid (TikTok, #rsv, accessed December 2025)."
  },
  {
   "t": "h3",
   "x": "Why Parents Look for Health Information on TikTok"
  },
  {
   "t": "p",
   "x": "Historically, a key pressure for immunization has been the requirement for children to be vaccinated to attend school. In 1855, Massachusetts was the first state to require the smallpox vaccine for children to attend school. By 1998-1999, “all but four U.S. states have vaccine requirements (mandates) for students entering kindergarten through 12th grade” but with many allowing for religious or philosophical exemptions (Mayo Clinic, accessed December 2025)."
  },
  {
   "t": "p",
   "x": "Vaccinations are also guided by the “Child and Adolescent Immunization Schedule by Age” provided by the Centers for Disease Control and Prevention (CDC), which indicate which immunizations should be provided and at what age (CDC, 2025). This set of recommendations includes nirsevimab and RSVpreF to help protect against RSV. However, the Trump administration has called for the CDC and Health and Human Services (HHS) to “update the United States core childhood vaccine schedule” (The White House, 2025). This came directly after a vaccine advisory panel voted to lift the recommendation for the Hepatitis B vaccine for newborns (Sun and Ovalle, 2025). The American Academy of Pediatrics diverged from the CDC and continues to recommend the full vaccine schedule (Inskeep, 2025). This inconsistency in recommendations has created uncertainty, leaving parents to fill in the absence of consistent and reliable guidance with other sources of trustworthy information."
  },
  {
   "t": "p",
   "x": "Parents already use the internet as a key source of information on whether to immunize their children, even though information online is “conflicting and inconsistent” when evaluated by experts (Ashfield and Donelle, 2020). Researchers Thale Strand and Thomas Westergren conducted a meta-ethnography in 2024 to evaluate parents’ “experiences of the Internet as a source of information.” Although parents do consult their health care providers, friends, and family for health advice, the Internet serves as a supplemental “24/7 available ‘go-to’”. This is mainly because of the convenience and affordability of accessing the Internet as compared to a doctor’s visit or consult, although parents find themselves “patching” together what they perceive as trustworthy and credible information (Strand and Westergren, 2024)."
  },
  {
   "t": "p",
   "x": "Although historically, parents have mostly searched for information using Google, Gen Z and Millennials are increasingly turning to TikTok’s search function as their preferred way to find information. In a survey of over 800 respondents, 64% of Gen Z and 48% of Millennials respondents reported that they used the platform as a search engine (Statista, 2025). This shift in information-seeking preference has implications for public health. When searching for RSV on Google, the top results include credible institutions like the Mayo Clinic, the CDC, the Cleveland Clinic, and the National Foundation for Infectious Diseases. Google claims that one of the key metrics that they use to rank search results is “quality,” or “content demonstrates expertise, authoritativeness, and trustworthiness” (Google, accessed December 2025)."
  },
  {
   "t": "p",
   "x": "On TikTok, however, when searching for RSV, the platform returns a multi-tabbed page that shows users “top” videos first (see Fig. 1). TikTok states that they rank videos “according to a combination of factors, including relevance to your search query and engagement. Relevance is determined based on things like video captions, video text, and hashtags” (TikTok, Search, 2025). Engagement metrics can include views, comments, likes, saves and shares. A video may be in the top results if it is relevant, i.e., refers to “RSV” in the caption, hashtags, subtitles, and if it is popular, i.e. has many views and likes. However, there does not seem to be any indications for trustworthiness or credibility (outside the credibility to self-identified HCP creators), reflecting the need for a comprehensive content moderation strategy for the platform. If young parents are searching for information using TikTok as a search engine, it is key that the content they discover first is trustworthy and useful."
  },
  {
   "t": "fig",
   "n": 1,
   "x": "RSV search result on TikTok. Screenshot on the desktop interface, taken December 12, 2025."
  },
  {
   "t": "p",
   "x": "Interestingly, a large amount of the content found when searching for “rsv” appears to come from self-identified health care professionals (HCPs). Indeed, in a survey of young women (assigned female at birth) aged 18-29, over 93% reported getting information from an HCP on the platform and 43.35% reported acting on that information, although they were unlikely to try to verify the credentials of the HCPs and instead were more likely to rely on cues like if the users had “Dr” in their usernames or wore labcoats, making them more susceptible to users pretending to be HCPs (Kirkpatrick and Lawrie, 2024)."
  },
  {
   "t": "h3",
   "x": "Content Moderation and TikTok’s Trust & Safety Teams"
  },
  {
   "t": "p",
   "x": "Moderating misinformation has evolved with the advent of new platforms like TikTok. Researchers Ethan Zuckerman and Chand Rajendra-Nicolucci detailed the evolution of moderation, from community-based norms and governance on Usenet in the 1990s, to the role of sysops (online bulletin board operators), to the emergence of Trust & Safety teams and content policies as a reaction to the proliferation of child sexual assault material (CSAM), Nazi paraphernalia and other disturbing content that began to be listed on user-generated content platforms and Internet index/listing services like Tripod, Craigslist, and Google. “Trust & Safety” has evolved into a commonplace professional and formalized corporate practice as a direct response to the rapid growth of users online and the need to address harmful content at scale. (Zuckerman and Rajendra-Nicolucci, 2023)."
  },
  {
   "t": "p",
   "x": "TikTok, too, has a Global Trust & Safety team, which publicly releases intermittent reports on its work through the TikTok Transparency Center, “to provide visibility into how we uphold our Community Guidelines and respond to law enforcement requests for information, government requests for content removals, and intellectual property removal requests” (TikTok, Transparency Center, accessed December 2025)."
  },
  {
   "t": "p",
   "x": "TikTok moderates content according to whether videos violate TikTok’s Community Guidelines. However, the way TikTok categorizes policy violations affects our ability to scrutinize the moderation, or lack thereof, of health misinformation. TikTok provides data on its video takedown actions, but health misinformation as a content type is grouped under the generalized “Misinformation” subcategory under the “Integrity and Authenticity” (I&A) category. Misinformation as a category includes other violations like “hoaxes, misleading AIGC, harmful conspiracy theories, and other false information related to public safety, crises, or major civic events” (TikTok, Integrity and Authenticity, 2025)."
  },
  {
   "t": "p",
   "x": "Of all of the video removal actions TikTok took between April and June of 2025, videos removed for I&A violations accounted for just 2% of removals (see Fig.2), and deeper within that category, videos removed for “Misinformation” violations accounted for 45% of I&A violations (see Fig. 3) (TikTok, Community guidelines enforcement report, 2025)."
  },
  {
   "t": "fig",
   "n": 2,
   "x": "Screenshot of a chart illustrating policy distribution of removals, with a highlight of Integrity and Authenticity policy violations, taken from TikTok’s Community guidelines enforcement report, October 10, 2025."
  },
  {
   "t": "fig",
   "n": 3,
   "x": "Screenshot of a chart illustrating policy distribution of removals, with a highlight of Misinformation policy violations, taken from TikTok’s Community guidelines enforcement report, October 10, 2025."
  },
  {
   "t": "p",
   "x": "Due to there not being a subcategory or label for videos containing health misinformation within “Misinformation,” knowing the percentage of videos TikTok has taken down because they spread health misinformation is impossible without further data or evidence. TikTok is also noted as having the most barriers to data for researchers, with their Research API having “highly selective criteria including extensive documentation requirements exceeding typical journal publication standards. Of particular concern, approved research projects focus primarily on either user behavior analysis or positive platform impacts, suggesting a potential selection bias” (Burnat and Davidson, 2025)."
  },
  {
   "t": "h3",
   "x": "The Shift Towards Automated Content Moderation Using Artificial Intelligence (AI)"
  },
  {
   "t": "p",
   "x": "The majority of content taken down by TikTok is actually currently removed via automation. In 2020, roughly 8% of all removed videos were done via automation. In 2025, that number has jumped dramatically to around 85% of videos being removed via automation, an increase of over 10x (see Fig. 4) (TikTok, Community guidelines enforcement report, 2025)."
  },
  {
   "t": "fig",
   "n": 4,
   "x": "Screenshot of a chart illustrating videos removed and restored, from 2020 to 2025, with information about how many were removed by automation, taken from TikTok’s Community guidelines enforcement report, October 10, 2025."
  },
  {
   "t": "p",
   "x": "This shift is reflected in TikTok’s decision to lay off human content moderators and Trust & Safety teams across the world. In September 2024, TikTok laid off their entire Dutch content moderation team in the Netherlands, triggering concerns in the European Parliament that the automated systems that TikTok uses would not be able to properly moderate Dutch-language content with appropriate linguistic nuance, nor would the platform be in compliance with the European Union’s Digital Services Act which “obliges platforms to take ‘reasoned decisions’ ‘under the supervision of appropriately qualified staff, and not solely on the basis of automated means’” (Van Sparrentak, 2024). Later that year, they fired around 500 content moderators in Malaysia (Latiff, 2024). Malaysia is a multi-ethnic and multilingual country, with major languages like Malay, Chinese, Tamil, and other smaller regional dialects (Ghazali, 2010). In 2025, the company continued to announce office closures and content moderation layoffs, a 40% reduction in Berlin (Kerr, 2025), 300 staffers in Ireland (McAuley, 2025), and around 400 staffers in the United Kingdom (Carroll, 2025)."
  },
  {
   "t": "p",
   "x": "TikTok argues that AI and automated systems are needed to review content to reduce the “amount of potentially distressing content that human moderators may need to review” (TikTok, Our approach to content moderation, accessed December 2025). The desire to reduce the pressure on “overburdened (and frequently exploited) contract workers, for whom the job of sifting through endless streams of unsavory user-generated content can have severe consequences” is valid (Bernard, 2025). However, some labor organizers and even T&S professionals themselves accuse TikTok, as well as other major tech companies, of using AI content moderation as an excuse to cut costs and bust unionization efforts (Moran et al., 2025; Mitchell, 2025)."
  },
  {
   "t": "p",
   "x": "Interestingly, TikTok claims that the COVID-19 pandemic was a large reason why they started relying “more heavily on technology to detect and automatically remove violating content” (TikTok, Community Guidelines Enforcement Report, 2020). It’s easy to see how a global infodemic of the sheer scale of the pandemic could put pressure on a platform to evolve its moderation tactics to cope, but the continued and growing disinvestment in human content moderators can contribute to infodemics in its own way."
  },
  {
   "t": "h3",
   "x": "The Challenges of Moderating Health Misinformation with AI"
  },
  {
   "t": "p",
   "x": "As this is not a technical paper, nor does the author have access to the TikTok Research API or information on what specific models TikTok is using, this section will be a general overview of the difficulties of using AI models to detect and moderate content containing health misinformation."
  },
  {
   "t": "p",
   "x": "Researchers Xiaoye Feng, Jia Luo, et al. conducted a systematic review of the literature on health information detection. A key difficulty they found in the work surrounding health misinformation was that “the dynamic nature of scientific consensus introduces an inherent relativity in defining misinformation,” or more simply, as new research comes out, medical guidance must change (Feng et al., 2025). This was reflected in evolving mask guidance during COVID-19 (Ramjee et al., 2023). In October 2025, the AAP declared that palivizumab (Synagis), one of the immunization options for RSV, is “no longer routinely recommended for use and will be discontinued” at the end of the year. However, this was because the manufacturer, Sobi, made the decision to discontinue the product after “the approval of two new immunizations in recent years that are recommended for a wider range of children and provide longer protection against RSV” (Jenco, 2025). Palivizumab requires monthly doses throughout the RSV season, compared to the new single-dose options now on the market."
  },
  {
   "t": "p",
   "x": "Another consideration for health misinformation is the datasets on which AI models are trained and what kind of access to external information they have. Automated fact-checking would likely not have access to constantly changing information about medications, unless they were connected to an external information resource like the Food and Drug Administration’s (FDA) SrLC (Drug Safety-related Labeling Changes) database which provides updates on “safety-related labeling changes,” which include information on which populations and conditions a drug is indicated for, as well as what side effects could occur (FDA, accessed December 14, 2025)."
  },
  {
   "t": "p",
   "x": "One way researchers have attempted to improve this need for knowledge, not just data, is by incorporating knowledge graphs to help improve “accuracy and interpretability through structured semantic associations and logical reasoning” (Feng et al., 2025). IBM defines a knowledge graph, “also known as a semantic network, represents a network of real-world entities—such as objects, events, situations or concepts—and illustrates the relationship between them. This information is usually stored in a graph database and visualized as a graph structure, prompting the term knowledge ‘graph.’” (IBM, accessed December 12, 2025). Creating this kind of knowledge graph for every significantly impactful disease would require collaboration between experts in both machine learning and public health, and would require constant updating to reflect up-to-date medical guidance."
  },
  {
   "t": "h3",
   "x": "Human Reactions Against Moderation and Ensuing Evasion"
  },
  {
   "t": "p",
   "x": "Beyond the technical limitations of content moderation, there are the human reactions to and against moderation. Ironically, the use of automated moderation for the most visually disturbing (and thus easily detectable by AI computer vision) content means users are rarely, if ever, exposed to content that would persuade them of the importance of content moderation."
  },
  {
   "t": "p",
   "x": "In a series of qualitative interviews with T&S professionals, researchers Moran, Schafar, Bayar, and Starbird explored the different shifts in attitude towards content moderation. During COVID-19, content moderation was heavily politicized, framed as censorship and in conflict with free speech, undermining the legitimacy of content moderation (Moran et al., 2025)."
  },
  {
   "t": "p",
   "x": "Users are also unlikely to come into contact with moderation unless it's within the context of a takedown of their own content, with a quote from one of Moran et al’s interviewees, “How people feel about T&S because their first interaction is like, oh, this new feature is so cool, but like, why is my post being flagged for nudity? Or like somebody’s out here to restrict my ability to freely express myself. Like these experiences suck.” (Moran et al., 2025)."
  },
  {
   "t": "p",
   "x": "Users complain of “shadow-banning,” or becoming essentially invisible on the platform, “hidden from some or all other users usually without the user's knowledge” (Moran et al., 2025; Merriam Webster Dictionary, accessed December 14, 2025). TikTok’s content moderation policy indicates that videos are “ineligible for recommendation into For You feeds if it's not appropriate for a broad audience” (TikTok. Our approach to content moderation. Accessed December 13, 2025)."
  },
  {
   "t": "p",
   "x": "Users also develop tactics for evasion of what they colloquially term “the algorithm,” which encompasses not just the recommendation algorithm but also the content moderation models. Without a technical or even accurate knowledge of the model, users develop “folk theories” on how the algorithm works and how to elude it (Moran et al., 2025). One common evasive tactic is “algospeak,” using proximate or commonly-agreed-upon words in place of “trigger” words or terms users believe the algorithm will detect. For example, “sewerslide” or “unalive,” for “suicide” and “kill” or “die” respectively (Schock et al., 2025)."
  },
  {
   "t": "p",
   "x": "Users can also use TikTok’s “sound” feature, which allows users to create videos using existing audio clips, as a means of evasion, especially to spread misinformation about more heavily monitored topics like #Covid. Researcher Morgan Lundy analyzed the role of audio memes in spreading COVID-19 misinformation on TikTok, noting that certain sounds had lyrics that users layered with their own anti-vaccine sentiment, like “‘I'm not that naive’ in Five for Fighting's ‘Superman’ (Ondrasik, 2001) was used to relate vaccine supporters to naivete, and the line ‘run for your children’ from Florence + The Machine's ‘Dog Days are Over’ (Welch & Summers, 2009) were used in a trend where parents picked up their children in the video and ran to protect their children from vaccination” (Lundy, 2023)."
  },
  {
   "t": "h3",
   "x": "Seeking Alternatives: Soft Moderation"
  },
  {
   "t": "p",
   "x": "In the face of resistance to “the algorithm” and the limitations of the algorithm itself, what public-facing, transparent, and scalable interventions can help users navigate misinformation? Video and account takedowns can be classified as “hard” moderation, making “decisions about content and accounts,” while “soft” moderation interventions can include “recommender systems, norms, design decisions, architectures” (Gorwa et al. 2020). These are product design interventions, and can look like warning labels or contextual tags flagging content as false (Clayton et al. 2019; Yamamoto et al. 2025; Sharevski et al. 2021), friction-based tactics like interstitial covers that require an acknowledgement from the user that the content may be misleading before they can view it (Sharevski et al. 2021), “accuracy nudges” that remind users to be aware of misinformation they may encounter while scrolling (Yamamoto et al. 2025) or to reflect on what they post or reshare like the successful “read before you retweet” prompts trialed by X in 2020 (Hatmaker, 2020) and mimicked by Meta in 2021 (Meta Newsroom, 2021)."
  },
  {
   "t": "p",
   "x": "Warning labels, ones that specifically flag content as “false,” are now some of the most common soft moderation interventions as they are “broadly effective” in reducing belief in and sharing misinformation, even among partisan users with a low trust in fact-checkers (Martel and Rand, 2024). On average, warning labels reduced belief in misinformation by 27.6% (12.9% for those with low TFC) and sharing by 24.7% (16.7% for those with low TFC) (Martel and Rand, 2024). General warnings, however, which just warned users to be on the lookout for misinformation, backfired and resulted in reducing users’ belief in true headlines (Clayton et al. 2019)."
  },
  {
   "t": "p",
   "x": "In contrast to warning labels, however, contextual tags, or flags that attempt to add context like “Get the facts on COVID-19” (or for our purposes, “Get the facts on RSV”), had no effect in dissuading users with pre-existing beliefs in misinformation, but rather formed “belief echoes” where they “convince people to believe in the discredited misinformation even more, not less, as long as it is aligned with their preexisting beliefs on morally-charged topics” (Sharevski et al. 2021)."
  },
  {
   "t": "p",
   "x": "Soft moderation tactics are finding more adoption across platforms, especially in Europe, where they are explicitly codified in the Code of Practice on Disinformation signed by Transparency Centre, a group of signatories self-regulating and responding to the EU’s DSA (Transparency Centre, Homepage, Accessed December 14, 2025)."
  },
  {
   "t": "p",
   "x": "Measure 21.1 of the Code asks signatories to “help users benefit from the context and insights provided by independent fact-checkers or authoritative sources, for instance by means of labels, such as labels indicating fact-checker ratings, notices to users who try to share or previously shared the rated content, information panels, or by acting upon content notified by fact-checkers that violate their policies” (Transparency Centre, Code of conduct on disinformation. Accessed December 15, 2025.)."
  },
  {
   "t": "p",
   "x": "TikTok shows an information panel when searching for “rsv” on the mobile app (not the desktop app), with AI-generated summaries from different credible sources (see Fig. 5) (TikTok, rsv, Accessed December 15, 2025). However, notably under “Prevention,” the summary only mentions the vaccines for adults 60+ and pregnant women, and not the immunizations for infants. It’s unclear if AI-generating summaries of even credible sources is the best approach."
  },
  {
   "t": "fig",
   "n": 5,
   "x": "Screenshots of results when searching for “rsv” on the TikTok mobile app. Accessed December 15, 2025."
  },
  {
   "t": "p",
   "x": "TikTok itself is a signatory to the Transparency Centre, but notably, is not subscribed to all measures of the code (at least of the most recent subscription form from January of 2025), stating “TikTok had not previously subscribed to Measures 22.1 to 22.6 which are not pertinent to its service given that TikTok does not deploy or provide trustworthiness indicators. TikTok instead relies on other means, such as fact-checking and media literacy campaigns, in order to empower its users and enable them to assess the veracity and relevance of the content they are exposed to” (Transparency Centre, Subscription Document for TikTok, January 2025)."
  },
  {
   "t": "h3",
   "x": "A New Feature: TikTok Footnotes"
  },
  {
   "t": "p",
   "x": "Seemingly inspired by X’s Community Notes feature, in July of 2025, Head of Operations and Trust & Safety Adam Presser announced that users in the US could join and contribute to TikTok Footnotes, a crowdsourced fact-checking feature with 80,000 “qualified” contributors signed up at the time (Presser, TikTok Newsroom, 2025). Additionally, like X’s Community Notes, users can rate footnotes (see Fig. 6) (Presser, 2025)."
  },
  {
   "t": "fig",
   "n": 6,
   "x": "A screenshot taken from TikTok’s announcement of Footnotes. Presser, July 30, 2025."
  },
  {
   "t": "p",
   "x": "While this does add a layer of much-needed fact-checking to the platform, the question remains: how many of those 80,000 contributors are medical experts? Much less ones with a specialty in pediatrics or experience in making recommendations for sick infants with RSV."
  },
  {
   "t": "p",
   "x": "There is also research around X’s own Community Notes that could help illustrate the issues that could occur with a similar approach. While Community Notes are effective once the notes are attached with a reduction of 13.5% in views, 21.9% in replies, 44.1% in likes, and 46.1% in reposts, i.e., “public expressions of support for content,” the intervention is weaker for reducing views of misinformation or replying to and engaging with it (Saveski et al. 2025). Reductions were also subject to the speed of attachment of a note, and in older “stale” notes, could actually draw more attention to the post (Saveski et al. 2025). Are TikTok Footnotes contributors retroactively annotating older yet popular posts? When searching for “rsv” on TikTok, one can find easily posts from 2022-2024 (since posts are not sorted chronologically but by engagement and relevance) about home remedies like “onion water,” “GOOT” which is a blend of garlic, eucalyptus essential oil and coconut oil, and homeopathic supplements (see Fig. 7) (TikTok, rsv, Accessed December 15, 2025)."
  },
  {
   "t": "fig",
   "n": 7,
   "x": "Screenshots of videos found when searching for “rsv” on the TikTok mobile app. Accessed December 15, 2025."
  },
  {
   "t": "p",
   "x": "The “GOOT” post by user @sophiebrissman. in particular, is called out by a “Top liked” flag in the results page. It’s important to note that eucalyptus oil, one of the key ingredients, can cause hospitalizations and even death in young children if ingested (Flaman et al. 2001). The user does call out that she wouldn’t use the oil for a baby under a year old, but Flaman et al.’s study indicates that multiple children over the age of 1 suffered severe symptoms (@sophiebrissman, 2024; Flaman et al., 2001). Also in the caption, the user calls out “big corps” and “big pharma,” indicating a position against pharmaceuticals and medications. The video has been shared over 44,000 times, indicating high diffusion or spread of misinformation."
  },
  {
   "t": "p",
   "x": "Another key reason that the note-flagging intervention is highly dependent on speed is that posts can go viral very quickly, with most views occurring in the “early (and most viral) stage of diffusion” before fact-checking can take place (Chuai et al. 2024). This is key to consider for a platform like TikTok, where its key advantage is its algorithm, which can very quickly lead to a video going viral with millions of views. Would health information videos be flagged to Footnotes contributors before being eligible for a broader algorithmic push?"
  },
  {
   "t": "h2",
   "x": "Proposed Alternatives: Informational Video Shelves and Fact-Checking with Video Replies by Trusted HCP Creators with Verified Credentials"
  },
  {
   "t": "p",
   "x": "When designing features, perhaps it is best to look at platforms with a more closely related form-factor, in this case, YouTube, which is also a video platform and indeed has launched its own mimic of TikTok’s short-form scrolling feed, YouTube Shorts. What YouTube does offer to the health information and misinformation conversation, however, is its “information shelves,” (see Fig. 8) a feature they announced in January of 2024."
  },
  {
   "t": "fig",
   "n": 8,
   "x": "Screenshots of information shelves seen when searching for different acute health crises."
  },
  {
   "t": "p",
   "x": "The shelves, pinned to the top of the results after a search, feature videos to assist users with acute care needs, like how to perform CPR, what to do if someone is having a heart attack, stroke, or opioid overdose (Graham, 2024). The feature is designed to offer guidance in the moments a user might need it most. While YouTube also does hard and soft moderation alike, this is a needs-based design choice, rather than a misinformation-policing choice. It’s important to always return to the needs of the users and the needs of parents who are worried about the health of their children."
  },
  {
   "t": "p",
   "x": "While YouTube partnered with organizations like Mass General Brigham and the Mexican Red Cross, TikTok could leverage its many HCPs users who already have built credibility and relationships with millions of users, like @doctormike also known as Dr. Mike Varshavski, a board-certified family physician with 2.6M followers. Under the hashtag #rsv, @dr.tommymartin, Tommy Martin M.D., has five of the top ten videos about the topic, and an audience of 2.6M followers."
  },
  {
   "t": "p",
   "x": "TikTok could also develop a badging system to help verify HCP credentials through primary source verification, connecting to databases to ensure that creators’ credentials are accurate and up-to-date (American Board of Medical Specialties, accessed December 15, 2025). TikTok’s current verification system only confirms a user is who they say they are, not what credentials they have. As Kirkpatrick and Lawrie point out in their study, the lack of credential verification can expose users to misinformation from people who self-identify as HCPs but do not actually possess board certification or credentials, which is especially dangerous because users significantly preferred information from HCP creators (Kirkpatrick and Lawrie, 2024). Credential verification is also important as we start to see a rise in AI deep-fake “doctors” creating misinformative videos leveraging real doctors’ images and voices (Campbell, 2025)."
  },
  {
   "t": "p",
   "x": "TikTok could identify the top health concerns of different audience demographics, and partner with culturally and demographically relevant HCP creators, as well as credible public health organizations, to create information video shelves of important content, switching out videos as new research and guidance come out. They could also enable video replies in Community Footnotes for credentialed experts to provide rebuttals to misinformation, as multi-media content is better for learning complex health information (Morgado et al. 2024)."
  },
  {
   "t": "p",
   "x": "Such interventions could satisfy users' desires for trustworthy, consistent, and up-to-date guidance on health issues like RSV, helping users make better health choices to help protect themselves and their families."
  },
  {
   "t": "h2",
   "x": "Considerations"
  },
  {
   "t": "p",
   "x": "This paper is heavily limited in terms of seeking to analyze how diverse populations differ in how they use TikTok (significant as healthcare access disparity is so pronounced), lacking in the technical knowledge needed to properly critique the infrastructure choices of the platform, and does not tackle the issue of the algorithm and the For You Feed which can serve health misinformation to users who are not even actively searching for any health content. Future studies in these areas would help us gain a better understanding of what interventions could be made in these areas."
  },
  {
   "t": "h2",
   "x": "Summary"
  },
  {
   "t": "p",
   "x": "As young people and parents turn to TikTok as a source of health guidance, especially in the face of access barriers to medical care, it becomes more and more important to help users navigate health misinformation by means of hard moderation (taking down misleading content), soft moderation (including warning flags, urging users to be wary of misinformation), and providing opportunities for education and advice from trusted creators with verified medical credentials and experience. Hopefully, the combination of these approaches, as well as a re-investment in human moderation in combination with knowledge-enhanced AI models, will help create a healthy information ecosystem in which parents can find the health information they need for their children and themselves to thrive."
  }
 ],
 "refs": [
  "Allyn, Bobby, Sylvia Goodman, and Dara Kerr. “Inside the TikTok Documents: Stripping Teens and Boosting ‘attractive’ People.” NPR, October 16, 2024. https://www.npr.org/2024/10/12/g-s1-28040/teens-tiktok-addiction-lawsuit-investigation-documents.",
  "American Academy of Pediatrics “RSV Immunization Frequently Asked Questions.” September 25, 2025. https://www.aap.org/en/patient-care/respiratory-syncytial-virus-rsv-prevention/rsv-frequently-asked-questions/.",
  "American Board of Medical Specialties “Verify Certification.” Accessed December 15, 2025. https://www.abms.org/board-certification/verify-certification/.",
  "American Lung Association. “RSV in Babies and Young Children,” Accessed November 13, 2025, https://www.lung.org/lung-health-diseases/lung-disease-lookup/rsv/babies.",
  "Ashfield, Sarah, and Lorie Donelle. “Parental Online Information Access and Childhood Vaccination Decisions in North America: Scoping Review.” Journal of medical Internet research, October 13, 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC7592069/.",
  "Associated Press. “Zuckerberg Says the White House Pressured Facebook to ‘censor’ Some COVID-19 Content during the Pandemic.” PBS, August 27, 2024. https://www.pbs.org/newshour/politics/zuckerberg-says-the-white-house-pressured-facebook-to-censor-some-covid-19-content-during-the-pandemic.",
  "Bernard, Tim. “Researchers Explore the Use of Llms for Content Moderation.” Tech Policy Press, October 30, 2025. https://www.techpolicy.press/researchers-explore-the-use-of-llms-for-content-moderation/.",
  "@sophiebrissman. “GOOT for RSV.” TikTok, December 7, 2024. https://www.tiktok.com/@sophiebrissman/video/7445875223762636074.",
  "Burnat, Florian A.D., and Brittany I. Davidson. The Accountability Paradox: How Platform API Restrictions Undermine AI Transparency Mandates, May 16, 2025. https://arxiv.org/html/2505.11577v1.",
  "Cagnotta, Cecilia, Nicoletta Lettera, Mirko Cardillo, Daniele Pirozzi, Daniel Catalán-Matamoros, Annalisa Capuano , and Cristina Scavone. “Parental Vaccine Hesitancy: Recent Evidences Support the Need to Implement Targeted Communication Strategies.” Journal of Infection and Public Health, February 2025. https://www.sciencedirect.com/science/article/pii/S1876034124003824.",
  "Campbell, Denis. “AI Deepfakes of Real Doctors Spreading Health Misinformation on Social Media.” The Guardian, December 5, 2025. https://www.theguardian.com/society/2025/dec/05/ai-deepfakes-of-real-doctors-spreading-health-misinformation-on-social-media.",
  "Carroll, Mickey. “Hundreds of UK Moderators Have Left TikTok - Sparking Safety Fears, Whistleblowers Reveal.” Sky News, December 4, 2025. https://news.sky.com/story/hundreds-of-uk-moderators-have-left-tiktok-sparking-safety-fears-whistleblowers-reveal-13478302.",
  "Centers for Disease Control and Prevention. “About RSV,” July 8, 2025, https://www.cdc.gov/rsv/about/index.html.",
  "Centers for Disease Control and Prevention. “Child and Adolescent Immunization Schedule by Age (Addendum Updated August 7, 2025).” October 7, 2025. CDC. Accessed December 2025. https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html.",
  "Chuai, Yuwei, Haoye Tian, Nicolas Pröllochs, and Gabriele Lenzini. “Did the Roll-Out of Community Notes Reduce Engagement With Misinformation on X/Twitter?” Association for Computing Machinery, November 8, 2024. https://dl.acm.org/doi/10.1145/3686967.",
  "Clayton, Katherine, Spencer Blair, Jonathan A. Busam, Samuel Forstner, John Glance, Guy Green, Anna Kawata, et al. “Real Solutions for Fake News? Measuring the Effectiveness of General Warnings and Fact-Check Tags in Reducing Belief in False Stories on Social Media - Political Behavior.” Political Behavior, February 11, 2019. https://link.springer.com/article/10.1007/s11109-019-09533-0.",
  "Eddy, Kirsten. “8 Facts about Americans and TikTok,” Pew Research Center, December 20,",
  "2024, https://www.pewresearch.org/short-reads/2024/12/20/8-facts-about-americans-and-tiktok/.",
  "Fitzpatrick, Alex. “The Average Age of New Moms across the U.S.” When U.S. women become moms, May 7, 2025. https://www.axios.com/2025/05/07/birth-rate-states.",
  "Flaman, Z, S Pellechia-Clarke, B Bailey, and M McGuigan. “Unintentional Exposure of Young Children to Camphor and Eucalyptus Oils.” Paediatrics & child health, February 2001. https://pmc.ncbi.nlm.nih.gov/articles/PMC2804512/.",
  "Food and Drug Administration. “Drug Safety-Related Labeling Changes (SRLC).” Drug Safety-related Labeling Changes (SrLC). Accessed December 14, 2025. https://www.accessdata.fda.gov/scripts/cder/safetylabelingchanges/index.cfm.",
  "Gabarron, Elia, Sunday Oluwafemi Oyeyemi, and Rolf Wynn. “Covid-19-Related Misinformation on Social Media: A Systematic Review.” Bulletin of the World Health Organization, June 1, 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8164188/.",
  "Garett, Renee, and Sean D Young. “Online Misinformation and Vaccine Hesitancy.” Translational behavioral medicine, December 14, 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8515268/.",
  "Ghazali, Kamila. National Identity and Minority languages, November 16, 2010. https://www.un.org/en/chronicle/article/national-identity-and-minority-languages.",
  "Google. “How Does Google Determine Ranking Results.” Google Search. Accessed December 12, 2025. https://www.google.com/intl/en_us/search/howsearchworks/how-search-works/ranking-results/.",
  "Gorwa, Robert, Reuben Binns, and Christian Katzenbach. Algorithmic content moderation: Technical and political challenges in the automation of platform governance, February 28, 2020. https://journals.sagepub.com/doi/full/10.1177/2053951719897945.",
  "Graham, Dr. Garth. “Elevating First Aid Information on Youtube Search.” blog.youtube, January 10, 2024. https://blog.youtube/news-and-events/first-aid-information-on-youtube-search/.",
  "Hamilton, David. How TikTok grew from a fun app for teens into a potential national security threat, January 19, 2025. https://apnews.com/article/tiktok-timeline-ban-biden-india-d3219a32de913f8083612e71ecf1f428",
  "Hatmaker, Taylor. “Twitter Plans to Bring Prompts to ‘read before You Retweet’ to All Users.” TechCrunch, September 24, 2020. https://techcrunch.com/2020/09/24/twitter-read-before-retweet/.",
  "Inskeep, Steve. “American Academy of Pediatrics President on Potential Changes to the Vaccine Schedule.” NPR, September 19, 2025. https://www.npr.org/2025/09/19/nx-s1-5545707/american-academy-of-pediatrics-president-on-potential-changes-to-the-vaccine-schedule.",
  "Holmes, Eric N, and Valerie C Brannon. “Section 230: An Overview.” Congress.gov, April 1, 2024. https://www.congress.gov/crs-product/R46751.",
  "IBM. “What Is a Knowledge Graph?” Accessed December 14, 2025. https://www.ibm.com/think/topics/knowledge-graph.",
  "Jafar, Zain, Jonathan D Quick, Heidi J Larson, Verner Venegas-Vera, Philip Napoli, Godfrey Musuka, Tafadzwa Dzinamarira, Kolar Sridara Meena, T Raju Kanmani, and Eszter Rimányi. “Social Media for Public Health: Reaping the Benefits, Mitigating the Harms.” Health promotion perspectives, July 10, 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC10439458/.",
  "Jenco, Melissa. “Sobi Discontinues RSV Injection Synagis.” American Academy of Pediatrics, August 12, 2025. https://publications.aap.org/aapnews/news/32817/Sobi-discontinues-RSV-injection-Synagis.",
  "Kerr, Dara. “Tiktok to Replace Trust and Safety Team in Germany with AI and Outsourced Labor.” The Guardian, August 10, 2025. https://www.theguardian.com/technology/2025/aug/10/tiktok-trust-safety-team-moderators-ai.",
  "Kirkpatrick, Ciera E, and LaRissa L Lawrie. “TikTok as a Source of Health Information and Misinformation for Young Women in the United States: Survey Study.” JMIR Infodemiology, May 21, 2024. https://infodemiology.jmir.org/2024/1/e54663/.",
  "Klonick, Kate. “The New Governors: The People, Rules, and Processes Governing Online Speech.” Harvard Law Review 131, no. 6 (April 2018): 1598–1670. https://doi.org/https://harvardlawreview.org/print/vol-131/the-new-governors-the-people-rules-and-processes-governing-online-speech/.",
  "Legal Information Institute. “47 U.S. Code § 230 - Protection for Private Blocking and Screening of Offensive Material.” Accessed November 28, 2025. https://www.law.cornell.edu/uscode/text/47/230.",
  "Lundy, Morgan. TikTok and COVID-19 Vaccine Misinformation: New Avenues for Misinformation Spread, Popular Infodemic Topics, and Dangerous Logical Fallacies, May 14, 2023. https://ijoc.org/index.php/ijoc/article/view/19847.",
  "Martel, Cameron, and David G. Rand. “Fact-Checker Warning Labels Are Effective Even for Those Who Distrust Fact-Checkers.” Nature News, September 2, 2024. https://www.nature.com/articles/s41562-024-01973-x.",
  "Mayo Clinic “Vaccine Requirements and Vaccine Research Highlights.” Accessed December 12, 2025. https://www.mayoclinic.org/diseases-conditions/history-disease-outbreaks-vaccine-timeline/requirements-research.",
  "McAuley, Eimer. “Tiktok Accused of ‘quietly’ Laying off Irish Workers amid Global Job Cuts.” TheJournal.ie, September 23, 2025. https://www.thejournal.ie/tiktok-ireland-2-6823497-Sep2025/.",
  "Merriam-Webster.com Dictionary, s.v. “shadow ban,” accessed December 14, 2025, https://www.merriam-webster.com/dictionary/shadow%20ban.",
  "Meta Newsroom (@MetaNewsroom), \"Starting today, we’re testing a way to promote more informed sharing of news articles. If you go to share a news article link you haven’t opened, we’ll show a prompt encouraging you to open it and read it, before sharing it with others.\" X, May 10, 2021, https://x.com/MetaNewsroom/status/1391816265891778560.",
  "Mitchell, Archie. “Tiktok Accused of ‘union-Busting’ after Laying off Hundreds of Content Moderators.” The Independent, August 22, 2025. https://www.the-independent.com/news/uk/politics/tiktok-bytedance-cwu-union-b2812500.html.",
  "Morgado, Mariana, João Botelho, Vanessa Machado, José João Mendes, Olusola Adesope, and Luís Proença. “Video-Based Approaches in Health Education: A Systematic Review and Meta-Analysis.” Nature News, October 10, 2024. https://www.nature.com/articles/s41598-024-73671-7#Sec20.",
  "Nielsen, Rasmus Kleis, Philip N Howard, Felix Simon, and J. Scott Brennen. “Types, Sources, and Claims of Covid-19 Misinformation.” Reuters Institute for the Study of Journalism, April 7, 2020. https://reutersinstitute.politics.ox.ac.uk/types-sources-and-claims-covid-19-misinformation.",
  "Office of the Surgeon General (OSG). Confronting Health Misinformation: The U.S. Surgeon General’s Advisory on Building a Healthy Information Environment [Internet]., 2021. https://www.ncbi.nlm.nih.gov/books/NBK572166/.",
  "Presser, Adam. “Rolling out TikTok Footnotes in the US.” TikTok Newsroom, July 30, 2025. https://newsroom.tiktok.com/rolling-out-tiktok-footnotes-in-the-us?lang=en.",
  "Ramjee, Divya, Catherine C Pollack, Marie-Laure Charpignon, Shagun Gupta, Jessica Malaty Rivera, Ghinwa El Hayek, Adam G Dunn, Angel N Desai, and Maimuna S Majumder. “Evolving Face Mask Guidance during a Pandemic and Potential Harm to Public Perception: Infodemiology Study of Sentiment and Emotion on Twitter.” Journal of medical Internet research, February 27, 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC9973548/.",
  "Rosenbluth, Teddy. Hundreds quarantined in South Carolina as measles outbreak shows no sign of slowing - The New York Times, December 11, 2025. https://www.nytimes.com/2025/12/11/well/measles-cases-outbreak-south-carolina.html.",
  "Saveski, Martin, Johan Ugander, Axel Peytavin, and Isaac Slaughter. “Community Notes Reduce Engagement with and Diffusion of False Information Online.” Proceedings of the National Academy of Sciences of the United States of America, September 18, 2025. https://www.pnas.org/doi/10.1073/pnas.2503413122.",
  "Schaller, Mark. “The Behavioural Immune System and the Psychology of Human Sociality.” Philosophical transactions of the Royal Society of London. Series B, Biological sciences, December 12, 2011. https://pmc.ncbi.nlm.nih.gov/articles/PMC3189350/.",
  "Schock, Bailie, S. Emre Kuraner, Maren Westphal, and George A. Bonanno. “How ‘Algospeak’ Is Changing Online Discourse on Suicide and Self-Harm: A Pilot Study.” Traumatology, June 2, 2025. https://doi.org/10.1037/trm0000581.",
  "Sharevski, Filipo, Raniem Alsaadi, Peter Jachim, and Emma Pieroni. “Misinformation Warnings: Twitter’s Soft Moderation Effects on Covid-19 Vaccine Belief Echoes.” Computers & Security, December 16, 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8675217/.",
  "Social Media Today. \"Media usage in an internet minute as of December 2024.\" Chart. December 18, 2024. Statista. Accessed November 23, 2025. https://www.statista.com/statistics/195140/new-user-generated-content-uploaded-by-users-per-minute/",
  "Statista Research Department, and Nov 28. “U.S. Consumers Using TikTok as Search Engine by Generation 2024.” Statista, November 28, 2025. https://www.statista.com/statistics/1538171/tiktok-usage-as-search-engine-united-states-by-generation/.",
  "Strand, Thale, and Thomas Westergren. A meta-Ethnography on Parents’ Experiences of the Internet As a Source of Health Information, July 30, 2024. https://pubmed.ncbi.nlm.nih.gov/39081710/.",
  "Sun, Lena H, and David Ovalle. “Trump Orders Review of Childhood Vaccine Schedule, Calls U.S. an ‘Outlier.’” The Washington Post, December 5, 2025. https://www.washingtonpost.com/health/2025/12/05/acip-childhood-immunization-schedule-hepatitis-b/.",
  "TikTok. Community guidelines enforcement report, October 10, 2025. https://www.tiktok.com/transparency/en-us/community-guidelines-enforcement-2025-2.",
  "TikTok. Community Guidelines Enforcement Report, September 22, 2020. Accessed December 13, 2025. https://www.tiktok.com/transparency/en-us/community-guidelines-enforcement-2020-1.",
  "TikTok. “#covid.” Accessed December 12, 2025. https://www.tiktok.com/tag/covid?lang=en.",
  "TikTok. “Integrity and Authenticity.” Accessed December 12, 2025. https://www.tiktok.com/community-guidelines/en/integrity-authenticity#1.",
  "TikTok. Our approach to content moderation. Accessed December 13, 2025. https://www.tiktok.com/transparency/en-us/content-moderation.",
  "TikTok. “#rsv.” Accessed December 12, 2025. https://www.tiktok.com/tag/rsv?lang=en.",
  "TikTok. “rsv.” Accessed December 15, 2025. https://www.tiktok.com/tag/rsv?lang=en.",
  "TikTok. “Transparency Center.” Accessed December 12, 2025. https://www.tiktok.com/transparency/en-us/.",
  "TikTok. “Search.” April 4, 2025. https://www.tiktok.com/creator-academy/en/article/search.",
  "Tomes, Nancy, and Manon S Parry. “What Are the Historical Roots of the Covid-19 Infodemic? Lessons from the Past.” National Center for Biotechnology Information, January 2022. https://www.ncbi.nlm.nih.gov/books/NBK585501/.",
  "Transparency Centre. “Code of conduct on disinformation.” Accessed December 15, 2025. https://disinfocode.eu/assets/pdfs/2025_Code_of_Conduct_on_Disinformation.pdf.",
  "Transparency Centre. “Subscription Document for TikTok.” January 2025. https://disinfocode.eu/storage/subscription-forms-files/2025-01-tiktok-subscription-form.pdf.",
  "Transparency Centre. “Transparency Centre” Homepage. Accessed December 14, 2025. https://disinfocode.eu/.",
  "Van Sparrentak, Kim. “Lay-off of TikTok’s Entire Content Moderation Team in the Netherlands and the DSA.” European Parliament, November 6, 2024. https://www.europarl.europa.eu/doceo/document/E-10-2024-002454_EN.html.",
  "Vombatkere, Karan, Sepehr Mousavi, Savvas Zannettou, Franziska Roesner, and Krishna P. Gummadi. “TikTok and the Art of Personalization: Investigating Exploration and Exploitation on Social Media Feeds.” arXiv.org, March 19, 2024. https://arxiv.org/abs/2403.12410.",
  "Wardle, Claire, and Hossein Derakhshan. Information disorder: Toward an interdisciplinary framework for research and Policymaking. Strasbourg Cedex: Council of Europe, 2017.",
  "The White House. “Fact Sheet: President Donald J. Trump Begins Process to Align U.S. Core Childhood Vaccine Recommendations with Best Practices from Peer, Developed Countries.” December 5, 2025. https://www.whitehouse.gov/fact-sheets/2025/12/fact-sheet-president-donald-j-trump-begins-process-to-align-u-s-core-childhood-vaccine-recommendations-with-best-practices-from-peer-developed-countries/.",
  "World Health Organization. “Infodemic.” Accessed November 30, 2025. https://www.who.int/health-topics/infodemic#tab=tab_1.",
  "Yamamoto, Masahiro, Cristian Vaccari, Jingjing Yi, and Michael Chan. “A Cross-National Examination of the Effects of Accuracy Nudges and Content Veracity Labels on Belief in and Sharing of Misleading News.” Journal of Computer-Mediated Communication, June 24, 2025. https://academic.oup.com/jcmc/article/30/4/zmaf009/8173297.",
  "Zuckerman, Ethan, and Chand Rajendra-Nicolucci. “From Community Governance to Customer Service and Back Again: Re-Examining Pre-Web Models of Online Governance to Address Platforms’ Crisis of Legitimacy.” Social Media + Society, September 8, 2023. https://journals.sagepub.com/doi/10.1177/20563051231196864."
 ]
};
