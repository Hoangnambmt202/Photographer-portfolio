
import AlbumsClient from "../modules/Album/AlbumClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlbumsSection = ({ data }: { data: any }) => {

  // const isInView = useInView(ref, { once: true, margin: "-100px" });
  // const albumsMock = [
  //   {
  //     title: "Đám cưới",
  //     count: 234,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  //   },
  //   {
  //     title: "Gia đình",
  //     count: 156,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
  //   },
  //   {
  //     title: "Chân dung",
  //     count: 189,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  //   },
  //   {
  //     title: "Sự kiện",
  //     count: 98,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  //   },
  //   {
  //     title: "Phong cảnh",
  //     count: 142,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  //   },
  //   {
  //     title: "Thương mại",
  //     count: 76,
  //     coverImage:
  //       "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
  //   },
  // ];

  return (
    // <section
    //   ref={ref}
    //   id="albums"
    //   className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-6"
    // >
    //   <div className="max-w-7xl mx-auto">
    //     <motion.div
    //       className="text-center mb-16"
    //       initial={{ opacity: 0, y: 30 }}
    //       animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    //       transition={{ duration: 0.8 }}
    //     >
    //       <h2 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
    //         Album của tôi
    //       </h2>
    //       <motion.div
    //         className="w-20 h-1 bg-black mx-auto mb-6"
    //         initial={{ width: 0 }}
    //         animate={isInView ? { width: 80 } : { width: 0 }}
    //         transition={{ duration: 0.8, delay: 0.3 }}
    //       />
    //       <motion.p
    //         className="text-xl text-gray-600 font-light"
    //         initial={{ opacity: 0 }}
    //         animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    //         transition={{ duration: 0.8, delay: 0.5 }}
    //       >
    //         Khám phá các Concept ảnh của chúng tôi
    //       </motion.p>
    //     </motion.div>

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       {data.map(
    //         (
    //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //           album: any,
    //           index: number
    //         ) => (
    //           <AlbumCard
    //             key={album.id}
    //             title={album.title}
    //             count={album.photo_quantity}
    //             coverImage={album.cover_image}
    //             index={index}
    //           />
    //         )
    //       )}
    //     </div>
    //   </div>
    // </section>
    <AlbumsClient initialAlbums={data} />
  );
};

export default AlbumsSection;
