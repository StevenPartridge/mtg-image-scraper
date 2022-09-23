const API_URL = 'https://api.scryfall.com';
const API_CARD_SEARCH = `${API_URL}/cards/search`;
const PROVIDED_QUERY = '?format=json&q=%28block%3Achk+or+block%3Aneo+or+set%3Anec%29+new%3Aart&unique=art';
// const PROVIDED_QUERY = '?format=json&q=hostage+taker'

import { ScryfallCard, ScryfallSearchResponse } from '../types';
import logger from './logger';

import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import sanitize from 'sanitize-filename';

type ImageObj = {
    uri: string;
    name: string;
}

class Util {
    sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getImages = async (): Promise<Map<string, ImageObj[]>> => {
        logger.printProgress('Beginning search');
        let nextPage: string | false = `${API_CARD_SEARCH}${PROVIDED_QUERY}`;
        const uniqueImages: Map<string, ImageObj[]> = new Map();
        let cardCount = 0;
        let totalCards = 0;
        while (nextPage) {
            await this.sleep(1000);
            const res = await axios.get(nextPage);
            const data: ScryfallSearchResponse = res.data;
            const cards: ScryfallCard[] = data.data;
            totalCards = data.total_cards;
            for (const card of cards) {
                await this.sleep(10);
                logger.printProgress(`Analyzing card ${cardCount} of ${totalCards}`);
                cardCount++;
                const imageTypes: Record<string, string> = card?.image_uris || {};
                Object.keys(imageTypes).forEach(imageType => {
                    const existing = uniqueImages.get(imageType) || [];
                    existing.push({ uri: imageTypes[imageType] as string, name: sanitize(card.name) });
                    uniqueImages.set(imageType, existing);
                });
            };

            nextPage = data.has_more ? data.next_page : false;
        }
        logger.stopProgress();
        return uniqueImages;
    }

    downloadImages = async (folderName: string, images: ImageObj[]): Promise<boolean> => {
        console.log(`Downloading ${folderName} images`);
        for (const index in images) {
            const image = images[index];
            logger.printProgress(`Downloading image ${index} of ${images.length}: ${image.name}`);
            await this.downloadImage(image.uri, folderName, image.name);
            await this.sleep(100);
        }
        logger.stopProgress();
        return true;
    }

    downloadImage = async (url: string, folder: string, filename: string) => {
        const filePath = path.resolve('output', folder, `${filename}.${folder === 'png' ? 'png' : 'jpg'}`);
        const dir = path.resolve('output', folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const writer = fs.createWriteStream(filePath);
        
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        
        response.data.pipe(writer)
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        });
    }
};

export const util = new Util();
