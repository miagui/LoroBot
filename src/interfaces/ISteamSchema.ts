export namespace SteamAppList {

    interface rootAppList {
        applist: Applist;
      }
    
    interface Applist {
        apps: App[];
    }
    
    interface App {
        appid: number;
        name: string;
    }
}

export namespace App {

      
      export interface Game {
        success: boolean;
        data: Data;
      }
      
      export interface Data {
        type: string;
        name: string;
        steam_appid: number;
        required_age: number;
        is_free: boolean;
        controller_support: string;
        dlc: number[];
        detailed_description: string;
        about_the_game: string;
        short_description: string;
        supported_languages: string;
        reviews: string;
        header_image: string;
        website: string;
        pc_requirements: Pcrequirements;
        mac_requirements: Pcrequirements;
        linux_requirements: Pcrequirements;
        legal_notice: string;
        developers: string[];
        publishers: string[];
        price_overview: Priceoverview;
        packages: number[];
        package_groups: Packagegroup[];
        platforms: Platforms;
        metacritic: Metacritic;
        categories: Category[];
        genres: Genre[];
        screenshots: Screenshot[];
        movies: Movie[];
        recommendations: Recommendations;
        achievements: Achievements;
        release_date: Releasedate;
        support_info: Supportinfo;
        background: string;
        content_descriptors: Contentdescriptors;
      }
      
      export interface Contentdescriptors {
        ids: any[];
        notes?: any;
      }
      
      export interface Supportinfo {
        url: string;
        email: string;
      }
      
      export interface Releasedate {
        coming_soon: boolean;
        date: string;
      }
      
      export interface Achievements {
        total: number;
        highlighted: Highlighted[];
      }
      
      export interface Highlighted {
        name: string;
        path: string;
      }
      
      export interface Recommendations {
        total: number;
      }
      
      export interface Movie {
        id: number;
        name: string;
        thumbnail: string;
        webm: Webm;
        highlight: boolean;
      }
      
      export interface Webm {
        '480': string;
        max: string;
      }
      
      export interface Screenshot {
        id: number;
        path_thumbnail: string;
        path_full: string;
      }
      
      export interface Genre {
        id: string;
        description: string;
      }
      
      export interface Category {
        id: number;
        description: string;
      }
      
      export interface Metacritic {
        score: number;
        url: string;
      }
      
      export interface Platforms {
        windows: boolean;
        mac: boolean;
        linux: boolean;
      }
      
      export interface Packagegroup {
        name: string;
        title: string;
        description: string;
        selection_text: string;
        save_text: string;
        display_type: number;
        is_recurring_subscription: string;
        subs: Sub[];
      }
      
      export interface Sub {
        packageid: number;
        percent_savings_text: string;
        percent_savings: number;
        option_text: string;
        option_description: string;
        can_get_free_license: string;
        is_free_license: boolean;
        price_in_cents_with_discount: number;
      }
      
      export interface Priceoverview {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
      }
      
      export interface Pcrequirements {
        minimum: string;
        recommended: string;
      }
    }