{ pkgs }: {
    deps = [
        pkgs.nodejs-18_x
        pkgs.nodePackages.typescript
        pkgs.ffmpeg
        pkgs.imagemagick
        pkgs.git
    ];
}
