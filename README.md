<img src="./readme/title1.svg"/>

## License

Licensed under the MIT License.  
See the [LICENSE](LICENSE) file for more information.

<br><br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

> JaMate is a Tinder-style platform that smartly matches musicians to jam together, form bands, and collaborate. It understands short recording snippets (mood, key, tempo, energy , etc..) to analyze track-to-track compatibility and generate adaptive backing tracks for seamless jamming.

<br><br>

<!-- System Design -->
<img src="./readme/title3.svg"/>

### Entity Relationship Diagram

<img src="./readme/diagram(1).svg"/>

### System design

<img src="./readme/system.jpeg"/>

### n8n

<img src="./readme/n8n2.PNG"/>

<br><br>

<!-- Project Highlights -->
<img src="./readme/title4.svg"/>

### Interesting feature

- Musician matching: Builds a personalized discovery feed by embedding user profiles, musical preferences, and activity, to surface the most relevant matches.

- Adaptive backing track generation: Uses pre-trained machine learning models to analyze short recording snippets (mood, key, tempo, etc.), analyze the compatibility of two tracks for jamming, and generate backing tracks that adapt to the musician’s sound.

- Band suggestions: Uses scheduled workflows, AI and similarity scoring to periodically evaluate embeddings and recommend potential band formations over time.

- AI-assisted setlist generation: An n8n workflow that analyzes band context and uses Spotify song metadata to build and order live-performance setlists.


<img src="./readme/feature.jpeg"/>

<br><br>

<!-- Demo -->
<img src="./readme/title5.svg"/>

### User Screens (Mobile)

| Landing | Register | Login |
|--------|----------|-------|
| <img src="./readme/Landing.jpeg" width="260" /> | <img src="./readme/register.jpeg" width="260" /> | <img src="./readme/Login.jpeg" width="260" /> |


| Create profile | Goals | Bio |
|---------------|-------|-----|
| <img src="./readme/create.gif" width="260" /> | <img src="./readme/welcom.jpeg" width="260" /> | <img src="./readme/goal.jpeg" width="260" /> |

| Feed | Match | Band suggestions |
|------|-------|------------------|
| <img src="./readme/feed.gif" width="260" /> | <img src="./readme/match.jpeg" width="260" /> | <img src="./readme/bandsugg.jpeg" width="260" /> |

| Tracks | Record | AI Backing tracks |
|--------|--------|-------------------|
| <img src="./readme/track.jpeg" width="260" /> | <img src="./readme/record.gif" width="260" /> | <img src="./readme/generate.gif" width="260" /> |

| Direct chats | Jam compatibility | Band chats |
|--------------|-------------------|------------|
| <img src="./readme/jam.gif" width="260" /> | <img src="./readme/convo.jpeg" width="260" /> | <img src="./readme/comptability.jpeg" width="260" /> |

| Group convo | Setlist | Members |
|-------------|---------|---------|
| <img src="./readme/bandconvo.jpeg" width="260" /> | <img src="./readme/setlist.gif" width="260" /> | <img src="./readme/members.jpeg" width="260" /> |

| Profile | Profile media | Edit profile |
|---------|---------------|--------------|
| <img src="./readme/profile.jpeg" width="260" /> | <img src="./readme/media.jpeg" width="260" /> | <img src="./readme/edit.gif" width="260" /> |

### Design

**Figma design**  
View the full UI and interaction flows on Figma:  
 [Open the design file](https://www.figma.com/design/H7B9SAWOytn5TBotlrf1b1/JaMate-figma?node-id=0-1&t=lbNFucGi3OifQOTE-1)

<br><br>

<!-- Development & Testing -->
<img src="./readme/title6.svg"/>

| Services                         | Validation                        | Testing                     |
| -------------------------------- | --------------------------------- | --------------------------- |
| ![Landing](./readme/service.PNG) | ![fsdaf](./readme/validation.PNG) | ![fsdaf](./readme/test.PNG) |

<br><br>

### Query optimization for performance

| Old version           | Better version        |
| --------------------- | --------------------- |
| ![](./readme/old.svg) | ![](./readme/new.svg) |

- Refactored a complex Eloquent query into a raw SQL query to minimize joins, reduce execution cost, and speed up candidate selection.

<br><br>

| Embedding-Driven Music Discovery & Band Formation | Audio analyze and Ai backing tracks |
| ------------------------------------------------- | ----------------------------------- |
| ![](./readme/workflow1.png)                       | ![](./readme/workflow2.jpeg)        |

<br><br>

### CLAP-Based Audio Semantic Analysis

| Code snippet                | CLAP model overview     |
| --------------------------- | ----------------------- |
| ![](./readme/clap-code.PNG) | ![](./readme/clap.jpeg) |

### Audio feature extraction pipeline

Audio files are loaded and normalized using SoundFile and librosa, then analyzed to extract tempo, key, and perceptual features. Tempo is estimated from rhythmic onsets, while key is detected via chroma analysis compared against Krumhansl major and minor profiles. In parallel, a CLAP-based model provides semantic descriptors such as style, emotion, and feel.

<!-- Deployment -->
<img src="./readme/title7.svg"/>


- This project uses an automated CI/CD pipeline with GitHub Actions to test and deploy the backend to production.

  
Docker was initially planned for the deployment setup, but hardware limitations preventing local virtualization led to a direct server-based deployment.



| API Register (Swagger) | CI / CD |
| --------------------- | ------- |
| ![](./readme/swagger.jpeg) | ![](./readme/CICD.PNG) |


<br><br>
