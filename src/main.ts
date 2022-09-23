import { util } from './helpers/util';

const main = async () => {
    const allImages = await util.getImages();
    const imageTypes = Array.from(allImages.keys());
    for (const imageType of imageTypes) {
        await util.downloadImages(imageType, allImages.get(imageType) || []);
    }
};

main();