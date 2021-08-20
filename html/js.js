fetch("data.json")
  .then((response) => response.json())
  .then((videos) => {
    // console.log(videos);
    displayVideos(videos);
    controls();
  });

const displayVideos = (videos) => {
  const htmlTemplate = document.querySelector("template");
  const root = document.querySelector("#root");

  videos.forEach((item, i) => {
    const template = htmlTemplate.content.cloneNode(true);
    const video = template.querySelector("video");
    const id = `id_${i + 1}`;
    video.src = `../videos/${item.videoName}`;
    video.id = id;

    root.appendChild(template);
  });
};

function controls() {
  const groups = document.querySelectorAll(".video-wrapper");
  groups.forEach((group, i) => {
    console.log(group, i);
    const id = `id_${i + 1}`;
    group.setAttribute("data-id", id);
    const inputs = group.querySelectorAll("input");

    inputs.forEach((input) => {
      input.setAttribute("data-id", id);
      input.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const value = input.value;
        console.log(this, id, value);
        const video = document.getElementById(id);
        video.currentTime = value;
        video.play();
      });
    });
  });
}
