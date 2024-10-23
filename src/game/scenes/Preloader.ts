import Phaser from "phaser";
import { IGameDataParams } from "../PhaserGame";

export type GameVoiceInfo = {
  id: string;
  name: string;
  avatar: string;
};
export const ObstacleNames = [
  "shiba",
  "appalled_girlfriend",
  "distracted_boyfriend",
  "harold",
  "meme_man",
  "pedro",
  "roll_safe",
  "wojack",
];
export default class Preloader extends Phaser.Scene {
  public params: IGameDataParams;
  constructor() {
    super("preloader");
  }

  init(data: IGameDataParams) {
    this.params = data;
  }

  // Create an off-screen canvas
  canvas = document.createElement("canvas");
  resize(img: HTMLImageElement) {
    const targetWidth = 46;
    const targetHeight = 46;
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");

    // Set initial size to original image size
    let width = img.width;
    let height = img.height;
    if (!ctx) return;
    // Resample in steps
    while (width > 2 * targetWidth && height > 2 * targetHeight) {
      width = Math.floor(width / 2);
      height = Math.floor(height / 2);

      // Resize the canvas to the new size
      canvas.width = width;
      canvas.height = height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);
    }

    // Now, do the final resize to the target dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Set high quality for the final resize
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the image at the final size
    ctx.drawImage(img, 0, 0, 46, 46);

    // canvas.toBlob((blob) => {
    //     if (blob) {
    //         const blobUrl = URL.createObjectURL(blob);
    //         const img = new Image();
    //         img.src = blobUrl;
    //         img.crossOrigin = "anonymous";
    //         const texture = this.textures.addImage("resizedImage", img);
    //         this.add.image(100, 100, "resizedImage").setOrigin(0.5, 0.5);
    //     }
    // });

    // Pass the resized image data to the callback
    return canvas.toDataURL();
  }
  preload() {
    console.log("Preloader...");
    this.load.image("green_dot", "assets/sprite/rhythmicpads/green_dot.png");
    this.load.image(
      "green_dot_outline",
      "assets/sprite/rhythmicpads/green_dot_outline.png"
    );
    this.load.image(
      "joystick_frame",
      "assets/sprite/rhythmicpads/joystick_frame.jpg"
    );
    this.load.image("background", this.params.backgroundPath.slice(1));
    ObstacleNames.map((name) => {
      this.load.image(
        `obstacle_${name}`,
        `assets/sprite/obstacles/${name}.png`
      );
    });
    this.load.image("hammer_1", "assets/sprite/weapons/hammer_level_1.png");
    this.load.image("hammer_2", "assets/sprite/weapons/hammer_level_2.png");
    this.load.image("whack", "/assets/sprite/weapons/whack.png");
    this.load.audio("low_whack", "/assets/sounds/low_whack.wav");
    this.load.audio("high_whack", "/assets/sounds/high_whack.wav");
    if (this.params.enableMotion)
      this.load.image("center_logo", "assets/transparent_logo.png");
    // TODO: Enable the below and comment out the rest of the images
    if (this.params.voices.length) {
      this.params.voices.map((voice) => {
        // this.load.image(voice.id, voice.avatar);
        // const image = new Image();
        // image.src = voice.avatar;
        // image.crossOrigin = "anonymous";
        // new Promise((res) => {
        //     image.onload = () => {
        //         const dataUrl = this.resize(image);
        //         res(dataUrl);
        //     };
        // }).then((dataurl) => {
        //     // Add the newly created image as a texture
        //     // this.textures.addBase64(`resized_${voice.id}`, dataurl);
        //     this.load.image(`resized_${voice.id}`, dataurl as string);
        // });
        this.load.image(`resized_${voice.id}`, voice.avatar);
        // this.load.image(
        //     `resized_${voice.id}_mouth`,
        //     `https://voxaudio.nusic.fm/voice_models%2Favatars%2Fthumbs%2Fgifs%2F${voice.id}_200x200.png?alt=media`
        // );
      });
    }
    // this.load.json(
    //     "screen_sprite_data",
    //     "assets/sprite/screen_sprite.json"
    // );
    // ["01", "16", "03", "07", "06"]
    this.params.selectedTracks.map((trackNo) => {
      switch (trackNo) {
        case "01":
          this.load.image("prod_texture_loaded_01", "assets/sprite/01.png");
          break;
        case "02":
        case "22":
          this.load.image("02_cross", "assets/sprite/02_cross.png");
          break;
        case "03":
          this.load.image("prod_texture_loaded_03", "assets/sprite/03.png");
          break;
        case "06":
          this.load.image("prod_texture_loaded_06", "assets/sprite/06.png");
          this.load.image("06b", "assets/sprite/06b.png");
          break;
        case "07":
          this.load.image("prod_texture_loaded_07", "assets/sprite/07.png");
          break;
        case "11":
          this.load.image("left_block", "assets/sprite/left_block.png");
          this.load.image("right_block", "assets/sprite/right_block.png");
          this.load.image("prod_texture_loaded_11", "assets/sprite/11.png");
          break;
        case "14":
          this.load.image("mini_star", "assets/sprite/14_mini.png");
          this.load.image("14_mini", "assets/sprite/14_mini.png");
          break;
        case "16":
          this.load.image("prod_texture_loaded_16", "assets/sprite/16.png");
          break;
        case "21":
          this.load.image("prod_texture_loaded_21", "assets/sprite/21.png");
          break;
      }
    });

    this.load.json("prod_shapes", "assets/physics/new_shapes.json");
    this.load.json("obstacles_shapes", "assets/physics/obstacles_shapes.json");
    // Mini
    this.load.image("bar", "assets/sprite/bar.png");
    this.load.json("mini_shapes", "assets/physics/mini_shapes.json");
    this.load.image("textureImage", this.params.skinPath);
    this.load.image("wheel", "assets/sprite/wheel.png");
    this.load.image("finish_line", "assets/finish.png");
    this.load.image("trail", this.params.trailPath);

    // this.load.once("complete", () => {
    //     const spriteData = this.cache.json.get("screen_sprite_data");

    //     this.params.selectedTracks.map((trackNo) => {
    //         switch (trackNo) {
    //             case "01":
    //                 const texture01 = this.textures
    //                     .get("prod_texture_loaded_01")
    //                     .getSourceImage();
    //                 this.textures.addAtlas(
    //                     "prod_texture_loaded_01",
    //                     texture01 as HTMLImageElement,
    //                     spriteData
    //                 );
    //                 break;
    //             case "02":
    //             case "22":
    //                 this.load.image(
    //                     "02_cross",
    //                     "assets/sprite/02_cross.png"
    //                 );
    //                 break;
    //             case "03":
    //                 this.load.atlas(
    //                     "prod_texture_loaded_03",
    //                     "assets/sprite/03.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //             case "06":
    //                 this.load.atlas(
    //                     "prod_texture_loaded_06",
    //                     "assets/sprite/06.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 this.load.image("06b", "assets/sprite/06b.png");
    //                 break;
    //             case "07":
    //                 this.load.atlas(
    //                     "prod_texture_loaded_07",
    //                     "assets/sprite/07.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //             case "11":
    //                 this.load.image(
    //                     "left_block",
    //                     "assets/sprite/left_block.png"
    //                 );
    //                 this.load.image(
    //                     "right_block",
    //                     "assets/sprite/right_block.png"
    //                 );
    //                 this.load.atlas(
    //                     "prod_texture_loaded_11",
    //                     "assets/sprite/11.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //             case "14":
    //                 this.load.image(
    //                     "mini_star",
    //                     "assets/sprite/14_mini.png"
    //                 );
    //                 this.load.atlas(
    //                     "14_mini",
    //                     "assets/sprite/14_mini.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //             case "16":
    //                 this.load.atlas(
    //                     "prod_texture_loaded_16",
    //                     "assets/sprite/16.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //             case "21":
    //                 this.load.atlas(
    //                     "prod_texture_loaded_21",
    //                     "assets/sprite/21.png",
    //                     "assets/sprite/screen_sprite.json"
    //                 );
    //                 break;
    //         }
    //     });
    // });
  }

  create() {
    // this.input.on(
    //     "wheel",
    //     (
    //         pointer: any,
    //         gameObjects: any,
    //         deltaX: any,
    //         deltaY: any,
    //         deltaZ: any
    //     ) => {
    //         this.cameras.main.scrollY += deltaY * 0.5; // Adjust the scroll speed
    //     }
    // );
    // this.matter.add.image(400, 300, 'sky')
    this.scene.start("game", this.params);

    // const particles = this.add.particles('red')

    // const emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: { start: 1, end: 0 },
    //     blendMode: 'ADD'
    // })

    // const logo = this.physics.add.image(400, 100, 'logo')

    // logo.setVelocity(100, 200)
    // logo.setBounce(1, 1)
    // logo.setCollideWorldBounds(true)

    // emitter.startFollow(logo)
  }
}
