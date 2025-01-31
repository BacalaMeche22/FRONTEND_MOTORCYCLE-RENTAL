export interface UserModel {
    user_id: string ;
    email: string;
    password:string;
    role:string;
    status:boolean
    first_name:string;
    last_name:string;
    address:string;
    birthdate:string;
    contact_no:string;
    gender:string;
    profile_pic:string ;

  }

  interface Booking {
    booking_id: string;
    booking_status: string;
    pickup_date: string;
    return_date: string;
    motor: {
      model: string;
    };
    user: {
      first_name: string;
      last_name: string;
    };
  }

  export interface IUnauthorizedRoutes {
    renterRoutes: string[];
    adminRoutes: string[];
    constructionWorkerRoutes: string[];
  }
  
  interface BookingData {
    pickup_date: string;
    total_amount: number;
  }