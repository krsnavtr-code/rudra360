import Project from "../models/Project.model.js";
import Category from "../models/category.model.js";
import Service from "../models/services.model.js";

/**
 * @desc    Check if an image is being used in the system
 * @route   GET /api/media/check-usage
 * @access  Private/Admin
 * @param   {string} url - The URL of the image to check
 * @returns {Object} Object containing usage information
 */
export const checkImageUsage = async (req, res) => {
    try {
        const { url } = req.query;
        console.log(url);

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Image URL is required'
            });
        }

        // Extract the filename from the URL and check for both production and local domains
        const filename = url.split('/').pop();
        const localUrl = `http://localhost:5173/${filename}`;
        const prodUrl = `https://trivixa.in/${filename}`;
        
        // Search in Projects
        const projectUsage = await checkProjectsForImage(filename);
        const localProjectUsage = await checkProjectsForImage(localUrl);
        const prodProjectUsage = await checkProjectsForImage(prodUrl);
        
        // Search in Categories
        const categoryUsage = await checkCategoriesForImage(filename);
        const localCategoryUsage = await checkCategoriesForImage(localUrl);
        const prodCategoryUsage = await checkCategoriesForImage(prodUrl);
        
        // Search in Services
        const serviceUsage = await checkServicesForImage(filename);
        const localServiceUsage = await checkServicesForImage(localUrl);
        const prodServiceUsage = await checkServicesForImage(prodUrl);

        // Combine results from all domains
        const combinedProjectUsage = {
            found: projectUsage.found || localProjectUsage.found || prodProjectUsage.found,
            count: projectUsage.count + localProjectUsage.count + prodProjectUsage.count,
            items: [...projectUsage.items, ...localProjectUsage.items, ...prodProjectUsage.items],
            local: localProjectUsage,
            production: prodProjectUsage
        };

        const combinedCategoryUsage = {
            found: categoryUsage.found || localCategoryUsage.found || prodCategoryUsage.found,
            count: categoryUsage.count + localCategoryUsage.count + prodCategoryUsage.count,
            items: [...categoryUsage.items, ...localCategoryUsage.items, ...prodCategoryUsage.items],
            local: localCategoryUsage,
            production: prodCategoryUsage
        };

        const combinedServiceUsage = {
            found: serviceUsage.found || localServiceUsage.found || prodServiceUsage.found,
            count: serviceUsage.count + localServiceUsage.count + prodServiceUsage.count,
            items: [...serviceUsage.items, ...localServiceUsage.items, ...prodServiceUsage.items],
            local: localServiceUsage,
            production: prodServiceUsage
        };

        const isUsed = combinedProjectUsage.found || combinedCategoryUsage.found || combinedServiceUsage.found;

        res.status(200).json({
            success: true,
            data: {
                isUsed,
                usageDetails: {
                    projects: combinedProjectUsage,
                    categories: combinedCategoryUsage,
                    services: combinedServiceUsage,
                    environments: {
                        local: {
                            projects: localProjectUsage,
                            categories: localCategoryUsage,
                            services: localServiceUsage
                        },
                        production: {
                            projects: prodProjectUsage,
                            categories: prodCategoryUsage,
                            services: prodServiceUsage
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error checking image usage:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while checking image usage'
        });
    }
};

// Helper function to check image usage in Projects
const checkProjectsForImage = async (filename) => {
    const imageFields = [
        'thumbnail',
        'heroImage',
        'gallery',
        'testimonial.avatar',
        'seo.ogImage'
    ];

    const query = {
        $or: [
            { thumbnail: { $regex: filename, $options: 'i' } },
            { heroImage: { $regex: filename, $options: 'i' } },
            { 'gallery': { $regex: filename, $options: 'i' } },
            { 'testimonial.avatar': { $regex: filename, $options: 'i' } },
            { 'seo.ogImage': { $regex: filename, $options: 'i' } }
        ]
    };

    const projects = await Project.find(query).select('title slug');
    
    return {
        found: projects.length > 0,
        count: projects.length,
        items: projects
    };
};

// Helper function to check image usage in Categories
const checkCategoriesForImage = async (filename) => {
    const categories = await Category.find({
        $or: [
            { image: { $regex: filename, $options: 'i' } }
        ]
    }).select('name slug');
    
    return {
        found: categories.length > 0,
        count: categories.length,
        items: categories
    };
};

// Helper function to check image usage in Services
const checkServicesForImage = async (filename) => {
    const services = await Service.find({
        $or: [
            { image: { $regex: filename, $options: 'i' } },
            { 'instructors.image': { $regex: filename, $options: 'i' } }
        ]
    }).select('title slug');
    
    return {
        found: services.length > 0,
        count: services.length,
        items: services
    };
};
