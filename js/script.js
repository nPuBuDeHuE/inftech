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
        let selectedFolder = document.querySelectorAll('.folder_name.selectedElem')[0];
        if (selectedFolder){
            rootFolder = selectedFolder.closest('.folder');
            rootFolder.remove();
            //console.log('selected folder yes - rootFolder is', rootFolder);
        }
    });

    /* Обрабатываем нажатие кнопки 'Удалить файл' */
    deleteFileLi.addEventListener('click', function(){
        let selectedFile = document.querySelectorAll('.file_name.selectedElem')[0];
        if (selectedFile){
            let fileName = selectedFile.querySelector('.fa-file-lines').dataset.name;
            delete arrFiles[fileName];
            rootFolder = selectedFile.closest('.fileRootFolder');
            rootFolder.remove();
            document.getElementById(fileName).remove();
            let fileDesc = fileContent.querySelector('div').dataset.desc;
            if (fileDesc == fileName){
                fileContent.innerHTML = '';
            }
        }
    });


    /*  Контролируем нажатие внутри fileBrowser
        Если нажата иконка папки - открываем и показываем вложения
        Если нажата иконка файла - показываем содержимое 
        Если что-то другое - то выделяем нажатую строку и убираем все
        другие выделения
    */
    fileBrowser.addEventListener("click", function(event){
        let selFolder = event.target.closest('.folder');
        let nameFolder = event.target;
        let listSubFolders;

        if (event.target.classList.contains('folder_expand')){
            if (event.target.classList.contains('fa-folder-closed')){
                openFolder(event.target);
            } else if (event.target.classList.contains('fa-folder-open')){
                closeFolder(event.target);
            }
        } 

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

        if (nameFolder.classList.contains('fa-file-lines')){
            let fileName = nameFolder.dataset.name;
            let headerName = nameFolder.dataset.newname ? nameFolder.dataset.newname : fileName;
            showFile(arrFiles[fileName]['file']);
            let checkHeader = document.getElementById(fileName);
            if (!document.getElementById(fileName)){
                let fileHeaderBlock = document.createElement('div');
                fileHeaderBlock.setAttribute('id', fileName);
                fileHeaderBlock.dataset.name = fileName;
                fileHeaderBlock.classList.add('fileHeader');
                fileHeaderBlock.innerHTML = headerName;
                fileHeaderList.append(fileHeaderBlock);
            }
        }
    })

    /*
    При нажатии на заголовок вкладки показываем содержимое файла
    */
    filePanel.addEventListener('click', function(event){
        let target = event.target;
        if (target.classList.contains('fileHeader')){
            let fileName = target.dataset.name;
            showFile(arrFiles[fileName]['file']);
        }
    })

    loadFileLi.addEventListener('click', () => {
        //
        createUploadForm();
        modalWindow.addEventListener('click', (event)=>{
            let target = event.target;
            switch (target.id){
                case "saveFileButton":
                    let file = loadFileInput.files[0];
                    let fileDescription = loadFileDesc.value;
                    if (file){
                        let selFolder = document.querySelector('.selectedElem') ? document.querySelector('.selectedElem') : rootName;
                        let rootFolder = selFolder.closest('.folder');
                        let fileContainer = document.createElement('div');
                        fileContainer.classList.add('fileRootFolder');
                        fileContainer.style.paddingLeft = rootFolder.dataset.level*10 + 'px';
                        fileContainer.innerHTML = `
                            <div class='file_name unselect'>
                                <i class="fa-solid fa-file-lines" data-name="${file.name}" title="${fileDescription}"></i>
                                &nbsp;${file.name}
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
    })


    renameLi.addEventListener('click', (event) => {
        let selectedElement = document.querySelector('.selectedElem');
        let rootElement;
        if (selectedElement){
            if (selectedElement.classList.contains('folder_name')){
                rootElement = selectedElement.closest('.folder');
                renameFolder(rootElement);
            }
            if (selectedElement.classList.contains('file_name')){
                rootElement = selectedElement.closest('.fileRootFolder');
                renameFile(rootElement);
            }
        }

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

function renameFolder(rootElement){
    let newName = prompt('Укажите новое имя папки', 'Новая папка 2');
    if (newName){
        rootElement.dataset.name = newName;
        let tCont = rootElement.querySelector('.folder_name').innerHTML;
        let arTcont = tCont.split('</i>');
        rootElement.querySelector('.folder_name').innerHTML = arTcont[0] + '</i>&nbsp;' + newName;
    }
    
}

function newFolder(targetFolder, folderName){
    let rootFolder = targetFolder.closest('.folder');
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
}

function renameFile(rootElement){
    createRenameForm();
    modalWindow.addEventListener('click', (event)=>{
        target = event.target;
        switch (target.id){
            case "cancelButton":
                removeModal('modalWindow');
            break;
            case "renameFileButton":
                let newName = renameFileInput.value;
                let newDescription = loadFileDesc.value;
                rootElement.querySelector('.fa-file-lines').title = newDescription;
                rootElement.querySelector('.fa-file-lines').dataset.newname = newName;
                let str4Split = rootElement.querySelector('.file_name').innerHTML;
                let arrStr = str4Split.split('</i>');
                rootElement.querySelector('.file_name').innerHTML = arrStr[0] + '</i>&nbsp;' + newName;
                removeModal('modalWindow');
            break;
        }
    });
}

function showFile(file){
    const type = file.type.replace(/\/.+/, '');
    if (type != 'text'){
        alert('Формат не поддерживается')
    } else {
        // создаем экземпляр объекта "FileReader"
        const reader = new FileReader()
        // читаем файл как текст
        // вторым аргументом является кодировка
        // по умолчанию - utf-8,
        // но она не понимает кириллицу
        //reader.readAsText(file, 'windows-1251')
        reader.readAsText(file);
        // дожидаемся завершения чтения файла
        // и помещаем результат в документ
        let textContent = document.createElement('div');
        textContent.dataset.desc = file.name;
        reader.onload = () => textContent.innerHTML = `<p><pre>${reader.result}</pre></p>`;
        fileContent.innerHTML = '';
        fileContent.append(textContent);
    }
}

function removeModal(elemID){
    document.getElementById(elemID).remove();
}

function createUploadForm(){
    if (document.getElementById('modalWindow')){
        document.getElementById('modalWindow').remove();
    }
    let fileDispenser = document.createElement('div');
    fileDispenser.classList.add('modalWindow')
    fileDispenser.setAttribute('id', 'modalWindow');
    fileDispenser.innerHTML = `
        <div class="modalContent">
            <div class='text-field'>
                <input class='text-field__input' id="loadFileInput" type="file" name="loadFileInput">
            </div>
            <div class='text-field'>
                <label htmlFor="loadFileDesc" className="text-field__label">Укажите описание</label>
                <textarea class='text-field__textarea' id="loadFileDesc"></textarea>
            </div>
            <div class='text-field'>
                <input class='text-field__button primary' id="saveFileButton" type="button" value="Сохранить">
                <input class='text-field__button' id="cancelButton" type="button" value="Отменить">
            </div>
        </div>
    `;

    document.body.append(fileDispenser);
}

function createRenameForm(){
    if (document.getElementById('modalWindow')){
        document.getElementById('modalWindow').remove();
    }
    let fileDispenser = document.createElement('div');
    fileDispenser.classList.add('modalWindow')
    fileDispenser.setAttribute('id', 'modalWindow');
    fileDispenser.innerHTML = `
        <div class="modalContent">
            <div class='text-field'>
                <label htmlFor="renameFileInput" className="text-field__label">Укажите новое имя</label>
                <input class='text-field__input' id="renameFileInput" type="text" name="renameFileInput">
            </div>
            <div class='text-field'>
                <label htmlFor="loadFileDesc" className="text-field__label">Укажите описание</label>
                <textarea class='text-field__textarea' id="loadFileDesc"></textarea>
            </div>
            <div class='text-field'>
                <input class='text-field__button primary' id="renameFileButton" type="button" value="Сменить">
                <input class='text-field__button' id="cancelButton" type="button" value="Отменить">
            </div>
        </div>
    `;

    document.body.append(fileDispenser);
}


