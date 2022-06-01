document.addEventListener("DOMContentLoaded", function() {
    //alert("DOM построен"); 
    console.log('DOM построен');

    var arrFiles = {};

    /* Обрабатываем нажатие кнопки 'Создать папку' */
    createFolderLi.addEventListener('click', () => {
        let selectedFolder = document.querySelector('.selectedElem');
        let folderName = prompt('Укажите имя папки', 'Новая папка');
        let rootFolder;
        if (folderName){
            if (selectedFolder){
                rootFolder = selectedFolder; //.closest('.folder');
                //console.log('selected folder yes - rootFolder is', rootFolder);
            } else {
                rootFolder = rootName;
                //console.log('selected folder no - rootFolder is', rootFolder);
            }
            newFolder(rootFolder, folderName);
        }
    });

    /* Обрабатываем нажатие кнопки 'Удалить папку' */
    deleteFolderLi.addEventListener('click', function(){
        let selectedFolder = document.querySelector('.selectedElem');
        if (selectedFolder){
            rootFolder = selectedFolder.closest('.folder');
            rootFolder.remove();
            //console.log('selected folder yes - rootFolder is', rootFolder);
        }
    });


    /*  Контролируем нажатие внутри fileBrowser
        Если нажата иконка папки - открываем и показываем вложения
        Если что-то другое - то выделяем нажатую строку 
    */
    fileBrowser.addEventListener("click", function(event){
        console.log('event.target', event.target);
        let selFolder = event.target.closest('.folder');
        let nameFolder = event.target;
        let listSubFolders;

        if (event.target.classList.contains('folder_expand')){
            if (event.target.classList.contains('fa-folder-closed')){
                openFolder(event.target);
            } else if (event.target.classList.contains('fa-folder-open')){
                closeFolder(event.target);
            }
        } else {
            if (nameFolder.classList.contains('unselect')){
                let arrSelFolders = fileBrowser.getElementsByClassName('selectedElem');
                for (arrItem of arrSelFolders){
                    arrItem.classList.remove('selectedElem');
                    arrItem.classList.add('unselect');
                }
                nameFolder.classList.remove('unselect');
                nameFolder.classList.add('selectedElem');
                
            } else if (nameFolder.classList.contains('selectedElem')){
                nameFolder.classList.add('unselect');
                nameFolder.classList.remove('selectedElem');
            }
        }
    })

    loadFileLi.addEventListener('click', () => {
        //
        createUploadForm();
        modalWindow.addEventListener('click', (event)=>{
            let target = event.target;
            console.log(target.id);
            switch (target.id){
                case "saveFileBitton":
                    //console.log(event.target);
                    let file = loadFileInput.files[0];
                    console.log('loadFileDesc', loadFileDesc);
                    let fileDescription = loadFileDesc.value;
                    console.log('fileDescription', fileDescription);
                    if (file){
                        console.log(file);
                        console.log(arrFiles); 
                        let selFolder = document.querySelector('.selectedElem') ? document.querySelector('.selectedElem') : rootName;
                        let rootFolder = selFolder.closest('.folder');
                        console.log('Выбрана папка ', rootFolder.dataset.name);
                        let fileContainer = document.createElement('div');
                        fileContainer.style.paddingLeft = rootFolder.dataset.level*10 + 'px';
                        fileContainer.innerHTML = `
                            <div class='file_name unselect'>
                                <i class="file_name fa-solid fa-file-lines data-name=${file.name}"></i>${file.name}
                            </div>
                        `;
                        rootFolder.querySelector('.folder_sub').append(fileContainer);
                        arrFiles[file.name] = {'file' : file, 'folder' : rootFolder.dataset.name}; 
                    } else {
                        alert('Файл не выбран!')
                    }
                    removeModal('modalWindow');
                break;
                case "cancelButton":
                    removeModal('modalWindow');
                break;
            }
            
        });
        
        /*
        console.log(loadFileInput.files);
        let file = loadFileInput.files[0];
        console.log(file);
        fileHandler(file);
        */
    })


    renameLi.addEventListener('click', () => {
        console.log(arrFiles);
    })




});

function openFolder(targetFolder){
    let selFolder = targetFolder.closest('.folder');
    targetFolder.classList.remove('fa-folder-closed');
    targetFolder.classList.add('fa-folder-open');
    selFolder.querySelector('.folder_sub').classList.remove('folder_content_hide');
    selFolder.querySelector('.folder_sub').classList.add('folder_content_show');
}

function closeFolder(targetFolder){
    let selFolder = targetFolder.closest('.folder');
    targetFolder.classList.remove('fa-folder-open');
    targetFolder.classList.add('fa-folder-closed');
    selFolder.querySelector('.folder_sub').classList.remove('folder_content_show');
    selFolder.querySelector('.folder_sub').classList.add('folder_content_hide');
    let listSubFolders = selFolder.querySelector('.folder_sub').querySelectorAll('.selectedElem');
    for (let subFolder of listSubFolders){
        subFolder.classList.remove('selectedElem');
        subFolder.classList.add('unselect');
    }
}

function newFolder(targetFolder, folderName){
    let rootFolder = targetFolder.closest('.folder');
    /* let inputContent = document.createElement('div');
    inputContent.style.margin = "4px 2px";
    inputContent.innerHTML = `
        <input class="folderName" type="text" value="Новая папка"><button class="folderName" type="button">Ок</button>
    `; */
    console.log('Folder created!');
    console.log(rootFolder);
    parentFolder = rootFolder.querySelector('.folder_sub');
    let parentLevel = +rootFolder.dataset.level;
    let currentLevel = parentLevel+1;
    let nF = document.createElement('div');
    nF.classList = 'folder';
    nF.dataset.level = currentLevel;
    nF.dataset.name = folderName;
    nF.style.paddingLeft = parentLevel*10 + 'px';
    let innerContent = `
        <div class="folder_name unselect">
            <i class="fa-solid fa-folder-closed folder_expand"></i> 
            ${nF.dataset.name}
        </div>
        <div class="folder_sub folder_content_hide"></div>
    `;
    nF.innerHTML = innerContent;
    parentFolder.append(nF);
    //parentFolder.append(inputContent);
}

function showFile(file){
    const type = file.type.replace(/\/.+/, '');
    console.log(type);
    if (type != 'text'){
        alert('Формат не поддерживается')
    } else {
        // создаем экземпляр объекта "FileReader"
        const reader = new FileReader()
        // читаем файл как текст
        // вторым аргументом является кодировка
        // по умолчанию - utf-8,
        // но она не понимает кириллицу
        reader.readAsText(file, 'windows-1251')
        // дожидаемся завершения чтения файла
        // и помещаем результат в документ
        let textContent = document.createElement('div');
        reader.onload = () => textContent.innerHTML = `<p><pre>${reader.result}</pre></p>`;
        fileContent.append(textContent);
    }
}

function removeModal(elemID){
    document.getElementById(elemID).remove();
}

function createUploadForm(){
    let fileDispenser = document.createElement('div');
        fileDispenser.classList.add('modalWindow')
        fileDispenser.setAttribute('id', 'modalWindow');
        fileDispenser.innerHTML = `
            <div class="modalContent">
                <div>
                    <input id="loadFileInput" type="file" name="loadFileInput">
                </div>
                <div>
                    <textarea id="loadFileDesc"></textarea>
                </div>
                <div>
                    <input id="saveFileBitton" type="button" value="Сохранить">
                    <input id="cancelButton" type="button" value="Отменить">
                </div>
            </div>
        `;

        document.body.append(fileDispenser);
}


