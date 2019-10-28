import { Router } from "express";
import AWS = require('aws-sdk');
import fs = require('fs');
import { logger } from "../services/logger/LoggerProvider";

export const VideosRouter = Router();

const s3 = new AWS.S3({ region: "eu-west-1" });


VideosRouter.get('/video', async (req, res) => {
    logger.debug(" some dev info ")
    logger.info(" video middleware ")
    logger.warn(" lol better no ")
    logger.error(" dafuq ")
    res.status(200).json({
        // src: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        src: "http://localhost:3000/video-content-local",
        poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
        title: "Big Bunck Bunny"
    });
});

VideosRouter.get('/video-content-local', function (req, res) {
    const path = 'assets/big_buck_bunny_720p_surround.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

VideosRouter.get('/video-content-redirect', async function (req, res) {
    res.redirect("https://api-vdeo.s3.eu-west-1.amazonaws.com/videos/sample.mp4?AWSAccessKeyId=AKIAIS4PKQ6KTCVV4LFQ&Expires=1572332936&Signature=9TEXmrN%2Bjw0G%2B08D0IgBa6j3IgI%3D");
});

VideosRouter.get('/video-content-range', async function (req, res) {
    const range = req.headers.range

    const objectParams = {
        Bucket: "api-vdeo",
        Key: "videos/sample.mp4",
    }

    console.log(`getting range ${range} from S3`);
    const request = s3.getObject({ ...objectParams, Range: range });

    request
        .on("httpHeaders", (statusCode, headers) => {
            console.log(statusCode, headers);
            res.writeHead(statusCode, headers);
        })
        .createReadStream()
        .pipe(res);

    // const resp = await s3.getObject({ ...objectParams, Range: range }).promise();
    // console.log(resp);
    // const head = {
    //     'Content-Range': resp.ContentRange,
    //     'Accept-Ranges': resp.AcceptRanges,
    //     'Content-Length': resp.ContentLength,
    //     'Content-Type': resp.ContentType,
    // }

    // res.writeHead(206, head);
    // request.createReadStream().pipe(res);
    // const obj = await s3.getObject({ ...objectParams, Range: range }).promise();
});
