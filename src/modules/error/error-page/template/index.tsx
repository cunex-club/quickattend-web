import IonIcon from "@shared/IonIcon";

const ErrorPageTemplate = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-200 p-6 md:p-8">
      <div className="flex min-h-[calc(100vh-3rem)] w-full items-center justify-center md:min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-[742px] px-10 py-10">
          <div className="flex flex-col items-center text-center">
            <IonIcon
              name="WarningOutline"
              size="84px"
              className="text-primary"
            />

            <div className="mt-6 space-y-4">
              <h1 className="headline-large-emphasized text-neutral-600">
                เกิดข้อผิดพลาดบางอย่าง!
              </h1>

              <p className="body-large-primary text-neutral-600">
                ขออภัยในความไม่สะดวก
                ขณะนี้ระบบของเรากำลังดำเนินการปรับปรุงและบำรุงรักษา
                <br />
                ทีมงานของเรากำลังทำงานอย่างเต็มที่เพื่อให้เว็บไซต์กลับมาให้บริการตามปกติโดยเร็วที่สุด
                <br />
                กรุณาลองเข้าใช้งานใหม่อีกครั้งในอีกสักครู่
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPageTemplate;
