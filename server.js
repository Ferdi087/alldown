import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url, format } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log(`Extracting info for ${url}...`);

        const isAudio = format === 'mp3';
        const isImage = format === 'png';

        // we use --dump-json to get the URL dynamically without saving locally
        const dlOptions = {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
        };

        const output = await youtubedl(url, dlOptions);

        let downloadUrl = output.url || (output.formats && output.formats.length > 0 ? output.formats[output.formats.length - 1].url : null);

        // Let's try to isolate audio vs video.
        if (isAudio && output.formats) {
            const audioFormats = output.formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none');
            if (audioFormats.length > 0) {
                // Get highest quality audio
                downloadUrl = audioFormats[audioFormats.length - 1].url;
            }
        } else if (!isImage && !isAudio && output.formats) {
            const videoFormats = output.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');
            if (videoFormats.length > 0) {
                downloadUrl = videoFormats[videoFormats.length - 1].url;
            } else {
                const bestVideo = output.formats.filter(f => f.vcodec !== 'none');
                if (bestVideo.length > 0) downloadUrl = bestVideo[bestVideo.length - 1].url;
            }
        }

        if (isImage) {
            downloadUrl = output.thumbnail || output.thumbnails?.[0]?.url;
        }

        if (!downloadUrl) {
            return res.status(500).json({ status: "error", error: "Could not extract download URL" });
        }

        return res.json({
            status: 'redirect',
            url: downloadUrl,
            title: output.title
        });

    } catch (error) {
        console.error("Youtube-dl extract error:", error);
        res.status(500).json({ status: "error", text: error.message || 'Failed to extract media details. Make sure the URL is public.' });
    }
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Downloader backend listening on http://localhost:${PORT}`);
});
