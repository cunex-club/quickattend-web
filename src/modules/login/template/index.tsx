import Image from "next/image";
import LoginLogo from "@assets/images/logo/login-logo.png";
import CunexLogo from "@assets/images/logo/cu-nex-mini.png";
import IonIcon from "@shared/IonIcon";

const LoginTemplate = () => {
  return (
    <div className="w-full h-screen bg-neutral-200">
      <div className="flex justify-center items-center h-full">
        <Image src={LoginLogo} alt="Login Logo" className="w-auto h-screen" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div>
          <div>
            <Image src={CunexLogo} alt="Cunex Logo" className="w-auto h-8" />
            <div>QuickAttendence</div>
          </div>
          <div>
            <div>
              <IonIcon name="PeopleOutline" />
              <div>สร้างกิจกรรมสำหรับแอพ CU NEX</div>
            </div>
            <div>
              <IonIcon name="BarcodeOutline" />
              <div>สแกนเข้าร่วมกิจกรรมด้วย Digital ID</div>
            </div>
            <div>
              <IonIcon name="LinkOutline" />
              <div>แชร์ลิงก์ให้คนอื่นมาช่วยได้ง่ายๆ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;
