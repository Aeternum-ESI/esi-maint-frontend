# Cloudinary Configuration

This project uses [next-cloudinary](https://next.cloudinary.dev/) for image uploads and transformations.

## Setup Instructions

1. Sign up for a Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/)
2. Create an unsigned upload preset:
    - Go to Settings > Upload
    - Scroll to "Upload presets" and click "Add upload preset"
    - Set "Signing Mode" to "Unsigned"
    - Configure any other upload options as needed
    - Save the preset name
3. Create a `.env.local` file in the root of your project with the following:

    ```
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
    ```

    Replace `your_cloud_name` with your Cloudinary cloud name (found in the dashboard)
    Replace `your_preset_name` with the name of the upload preset you created

4. Install the next-cloudinary package:
    ```bash
    npm install next-cloudinary
    # or
    yarn add next-cloudinary
    # or
    pnpm add next-cloudinary
    ```

## Usage

The Cloudinary upload widget is integrated into the report form. Users can upload images either by:

1. Taking a photo with their device camera
2. Selecting an image from their device

The image URL is stored in the report and sent to the backend.

## Documentation

For more information on customizing the upload widget, see the [next-cloudinary documentation](https://next.cloudinary.dev/).
